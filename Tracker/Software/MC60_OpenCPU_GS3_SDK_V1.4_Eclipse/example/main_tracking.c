/*****************************************************************************
*  Copyright Statement:
*  --------------------
*  This software is protected by Copyright and the information contained
*  herein is confidential. The software may not be copied and the information
*  contained herein may not be used or disclosed except with the written
*  permission of Quectel Co., Ltd. 2013
*
*****************************************************************************/
/*****************************************************************************
 *
 * Filename:
 * ---------
 *   example_watchdog.c
 *
 * Project:
 * --------
 *   OpenCPU
 *
 * Description:
 * ------------
 *   This example demonstrates how to program module location with APIs in OpenCPU.
 *   All debug information will be output through DEBUG port.
 *
 * Usage:
 * ------
 *   1. Redefine the APN according to your network in the codes below.
 *
 *   2. Compile & Run:
 *
 *     Set "C_PREDEF=-D __EXAMPLE_LOCATION__" in gcc_makefile file. And compile the
 *     app using "make clean/new".
 *     Download image bin to module to run.
 *
 * Author:
 * -------
 * -------
 *
 *============================================================================
 *             HISTORY
 *----------------------------------------------------------------------------
 *
 ****************************************************************************/
#define __TRACKING__
#ifdef __TRACKING__
#include "ql_stdlib.h"
#include "ql_uart.h"
#include "ql_system.h"
#include "ql_trace.h"
#include "ql_gprs.h"
#include "ql_type.h"
#include "ql_time.h"
#include "ql_error.h"
#include "ril.h"
#include "ril_network.h"
#include "ril_location.h"
#include "ril_bluetooth.h"

/****************************************************************************
* Definition for APN
****************************************************************************/
#define APN      "CMNET\0"
#define USERID   ""
#define PASSWD   ""

#define t_sleep 	10000 	//10s
#define HTTP_URL_ADDR   "http://phuongleofficial.sytes.net:8000/data_collect/collectData" //"http://hoangphuongserver.ddns.net:8888/data_collect/testpost/\0"
#define packeid "350"

#define DEBUG_ENABLE 1
#if DEBUG_ENABLE > 0
#define DEBUG_PORT  UART_PORT1
#define DBG_BUF_LEN   512
static char DBG_BUFFER[DBG_BUF_LEN];
#define APP_DEBUG(FORMAT,...) {\
    Ql_memset(DBG_BUFFER, 0, DBG_BUF_LEN);\
    Ql_sprintf(DBG_BUFFER,FORMAT,##__VA_ARGS__); \
    if (UART_PORT2 == (DEBUG_PORT)) \
    {\
        Ql_Debug_Trace(DBG_BUFFER);\
    } else {\
        Ql_UART_Write((Enum_SerialPort)(DEBUG_PORT), (u8*)(DBG_BUFFER), Ql_strlen((const char *)(DBG_BUFFER)));\
    }\
}
#else
#define APP_DEBUG(FORMAT,...)
#endif

static char HTTP_POST_MSG[225];
static char curr_Lat[11];
static char curr_Long[11];
static char curr_Temp[2];
static char curr_Humid[2];
static char timestamp[19];
static char devid[2] = "1";
//static char packeid[2];
//static u32 packe_id = rand();


static char bt_name[BT_NAME_LEN]; // QUECTEL
static ST_BT_DevInfo **g_dev_info = NULL;
static u8 SppSendBuff[5]="DATA?";// data which MC60 send to HC05
static u8 SppReceiverBuff[30];
static ST_BT_BasicInfo pSppRecHdl;
static ST_BT_DevInfo BTSppDev1 = {0};

void CallBack_UART_Hdlr(Enum_SerialPort port, Enum_UARTEventType msg, bool level, void* customizedPara)
{
}

void Callback_Location(s32 result,ST_LocInfo* loc_info);
void BT_Callback(s32 event, s32 errCode, void* param1, void* param2);
char *FloatToString( double f);
void  mystrcat(char *buffout, const char *buffin, int buffin_len);
char *msg_create (const char * devid, const char * packetid, const char *timestamp, const char *curr_Temp, const char * curr_Humid, const char * curr_Lat, const char * curr_Long, const char * locked, char *msg);
void Location_Program(void);
void HTTP_Program();
void BT_COM_Demo(void);
void Get_Timestamp(void);

/************************************************************************/
/*                                                                      */
/* The entrance to application, which is called by bottom system.       */
/*                                                                      */
/************************************************************************/
void proc_main_task(s32 taskId)
{
    s32 ret;
    ST_MSG msg;

    // Register & open UART port
    Ql_UART_Register(UART_PORT1, CallBack_UART_Hdlr, NULL);
    Ql_UART_Open(UART_PORT1, 115200, FC_NONE);
    Ql_UART_Register(UART_PORT2, CallBack_UART_Hdlr, NULL);
    Ql_UART_Open(UART_PORT2, 115200, FC_NONE);
    APP_DEBUG("\r\n<-- OpenCPU: Demo for HTTP POST Program -->\r\n");

    while (TRUE)
    {
         Ql_OS_GetMessage(&msg); // Get Message
        switch(msg.message)
        {
            case MSG_ID_RIL_READY:
                APP_DEBUG("<-- RIL is ready -->\r\n");
                Ql_RIL_Initialize();
                break;
            case MSG_ID_URC_INDICATION:
                switch (msg.param1)
                {
                case URC_SIM_CARD_STATE_IND:
                    if (SIM_STAT_READY == msg.param2)
                    {
                        APP_DEBUG("<-- SIM card is ready -->\r\n");
                    }else{
                        APP_DEBUG("<-- SIM card is not available, cause:%d -->\r\n", msg.param2);
                    }
                    break;
                case URC_GSM_NW_STATE_IND:
                    if (NW_STAT_REGISTERED == msg.param2 || NW_STAT_REGISTERED_ROAMING == msg.param2)
                    {
                        APP_DEBUG("<-- Module has registered to GSM network -->\r\n");
                    }else{
                        APP_DEBUG("<-- GSM network status:%d -->\r\n", msg.param2);
                    }
                    break;
                case URC_GPRS_NW_STATE_IND:
                    if (NW_STAT_REGISTERED == msg.param2 || NW_STAT_REGISTERED_ROAMING == msg.param2)
                    {
                        APP_DEBUG("<-- Module has registered to GPRS network -->\r\n");
							Location_Program();
                    }else{
                        APP_DEBUG("<-- GPRS network status:%d -->\r\n", msg.param2);
                    }
                    break;
                default:
                    break;
                }
        default:
            break;
        }
    }
}

void Location_Program(void)
{
	u8  pdpCntxtId;
	u8 location_mode = 0;

	Ql_GPRS_GetPDPContextId();// Set PDP context
	RIL_NW_SetGPRSContext(pdpCntxtId);//Set GPRS Context
	RIL_NW_SetAPN(1, APN, USERID, PASSWD);//Set APN
	APP_DEBUG("<--Ql_Getlocation-->\r\n");
	RIL_GetLocation(Callback_Location);
}

void  mystrcat(char *buffout, const char *buffin, int buffin_len){
	int tail = 0;
	int i;
	while(buffout[tail]) tail ++;
	for(i = tail; i < tail + buffin_len; i++)
	{
		buffout[i] = buffin[i - tail];
	}
	return;
}

char *msg_create (const char * devid, const char * packetid, const char *timestamp, const char *curr_Temp, const char * curr_Humid, const char * curr_Lat, const char * curr_Long, const char * locked, char *msg){

	mystrcat(msg, "devid=", 6);
	mystrcat(msg, devid, 2);
	mystrcat(msg, "&packetid=", 10);
	mystrcat(msg, packetid,10);
	mystrcat(msg, "&timestamp=", 11);
	mystrcat(msg, timestamp, 19);
	mystrcat(msg, "&curr_Lat=", 10);
	mystrcat(msg, curr_Lat, 11);
	mystrcat(msg, "&curr_Long=", 11);
	mystrcat(msg, curr_Long, 11);
	mystrcat(msg, "&curr_Humid=", 12);
	mystrcat(msg, curr_Humid, 2);
	mystrcat(msg, "&curr_Temp=", 11);
	mystrcat(msg, curr_Temp, 2);
	mystrcat(msg, "&locked=", 8);
	mystrcat(msg, locked, 5);
	return msg;
}


char *FloatToString( double f){

	double kq;
	kq=f*1000000;
	if(f>=100){					// f=170.123456
		static char a[9];
		a[0]=kq/100000000;	a[0]=a[0]+48;
		a[1]=kq/10000000-(a[0]-48)*10;	a[1]=a[1]+48;
		a[2]=kq/1000000-(a[0]-48)*100-(a[1]-48)*10;	a[2]=a[2]+48;
		a[3]='.';
		a[4]=kq/100000-(a[0]-48)*1000-(a[1]-48)*100-(a[2]-48)*10;	a[4]=a[4]+48;
		a[5]=kq/10000-(a[0]-48)*10000-(a[1]-48)*1000-(a[2]-48)*100-(a[4]-48)*10;	a[5]=a[5]+48;
		a[6]=kq/1000-(a[0]-48)*100000-(a[1]-48)*10000-(a[2]-48)*1000-(a[4]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=kq/100-(a[0]-48)*1000000-(a[1]-48)*100000-(a[2]-48)*10000-(a[4]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;
		a[8]=kq/10-(a[0]-48)*10000000-(a[1]-48)*1000000-(a[2]-48)*100000-(a[4]-48)*10000-(a[5]-48)*1000-(a[6]-48)*100-(a[7]-48)*10;	a[8]=a[8]+48;
		a[9]=kq-(a[0]-48)*100000000-(a[1]-48)*10000000-(a[2]-48)*1000000-(a[4]-48)*100000-(a[5]-48)*10000-(a[6]-48)*1000-(a[7]-48)*100-(a[8]-48)*10;	a[9]=a[9]+48;
		return a;
	}
	else if(f<100 && f>=10){		// f=56.123456
		static char a[8];
		a[0]=kq/10000000;	a[0]=a[0]+48;
		a[1]=kq/1000000-(a[0]-48)*10;	a[1]=a[1]+48;
		a[2]='.';
		a[3]=kq/100000-(a[0]-48)*100-(a[1]-48)*10;	a[3]=a[3]+48;
		a[4]=kq/10000-(a[0]-48)*1000-(a[1]-48)*100-(a[3]-48)*10;	a[4]=a[4]+48;
		a[5]=kq/1000-(a[0]-48)*10000-(a[1]-48)*1000-(a[3]-48)*100-(a[4]-48)*10;	a[5]=a[5]+48;
		a[6]=kq/100-(a[0]-48)*100000-(a[1]-48)*10000-(a[3]-48)*1000-(a[4]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=kq/10-(a[0]-48)*1000000-(a[1]-48)*100000-(a[3]-48)*10000-(a[4]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;
		a[8]=kq-(a[0]-48)*10000000-(a[1]-48)*1000000-(a[3]-48)*100000-(a[4]-48)*10000-(a[5]-48)*1000-(a[6]-48)*100-(a[7]-48)*10;	a[8]=a[8]+48;
		return a;
	}

	else if(f<10 && f>=0){			//f=5.123456
		static char a[7];
		a[0]=kq/1000000;	a[0]=a[0]+48;
		a[1]='.';
		a[2]=kq/100000-(a[0]-48)*10;	a[2]=a[2]+48;
		a[3]=kq/10000-(a[0]-48)*100-(a[2]-48)*10;	a[3]=a[3]+48;
		a[4]=kq/1000-(a[0]-48)*1000-(a[2]-48)*100-(a[3]-48)*10;	a[4]=a[4]+48;
		a[5]=kq/100-(a[0]-48)*10000-(a[2]-48)*1000-(a[3]-48)*100-(a[4]-48)*10;	a[5]=a[5]+48;
		a[6]=kq/10-(a[0]-48)*100000-(a[2]-48)*10000-(a[3]-48)*1000-(a[4]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=kq-(a[0]-48)*1000000-(a[2]-48)*100000-(a[3]-48)*10000-(a[4]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;
		return a;
	}

	else if(f<0 && f>-10){		//f=-6.123456
		static char a[8];
		a[0]='-';
		a[1]=-kq/1000000;	a[1]=a[1]+48;
		a[2]='.';
		a[3]=-kq/100000-(a[1]-48)*10;	a[3]=a[3]+48;
		a[4]=-kq/10000-(a[1]-48)*100-(a[3]-48)*10;	a[4]=a[4]+48;
		a[5]=-kq/1000-(a[1]-48)*1000-(a[3]-48)*100-(a[4]-48)*10;	a[5]=a[5]+48;
		a[6]=-kq/100-(a[1]-48)*10000-(a[3]-48)*1000-(a[4]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=-kq/10-(a[1]-48)*100000-(a[3]-48)*10000-(a[4]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;;
		a[8]=-kq-(a[1]-48)*1000000-(a[3]-48)*100000-(a[4]-48)*10000-(a[5]-48)*1000-(a[6]-48)*100-(a[7]-48)*10;	a[8]=a[8]+48;
		return a;
	}

	else if(f<=-10 && f>-100){		// f=-45.123456
		static char a[9];
		a[0]='-';
		a[1]=-kq/10000000;	a[1]=a[1]+48;
		a[2]=-kq/1000000-(a[1]-48)*10;	a[2]=a[2]+48;
		a[3]='.';
		a[4]=-kq/100000-(a[1]-48)*100-(a[2]-48)*10;	a[4]=a[4]+48;
		a[5]=-kq/10000-(a[1]-48)*1000-(a[2]-48)*100-(a[4]-48)*10;	a[5]=a[5]+48;
		a[6]=-kq/1000-(a[1]-48)*10000-(a[2]-48)*1000-(a[4]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=-kq/100-(a[1]-48)*100000-(a[2]-48)*10000-(a[4]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;
		a[8]=-kq/10-(a[1]-48)*1000000-(a[2]-48)*100000-(a[4]-48)*10000-(a[5]-48)*1000-(a[6]-48)*100-(a[7]-48)*10;	a[8]=a[8]+48;
		a[9]=-kq-(a[1]-48)*10000000-(a[2]-48)*1000000-(a[4]-48)*100000-(a[5]-48)*10000-(a[6]-48)*1000-(a[7]-48)*100-(a[8]-48)*10;	a[9]=a[9]+48;
		return a;
	}

	else if(f<=-100){		// f=-145.123456
		static char a[10];
		a[0]='-';
		a[1]=-kq/100000000;	a[1]=a[1]+48;
		a[2]=-kq/10000000-(a[1]-48)*10;	a[2]=a[2]+48;
		a[3]=-kq/1000000-(a[1]-48)*100-(a[2]-48)*10;	a[3]=a[3]+48;
		a[4]='.';
		a[5]=-kq/100000-(a[1]-48)*1000-(a[2]-48)*100-(a[3]-48)*10;	a[5]=a[5]+48;
		a[6]=-kq/10000-(a[1]-48)*10000-(a[2]-48)*1000-(a[3]-48)*100-(a[5]-48)*10;	a[6]=a[6]+48;
		a[7]=-kq/1000-(a[1]-48)*100000-(a[2]-48)*10000-(a[3]-48)*1000-(a[5]-48)*100-(a[6]-48)*10;	a[7]=a[7]+48;
		a[8]=-kq/100-(a[1]-48)*1000000-(a[2]-48)*100000-(a[3]-48)*10000-(a[5]-48)*1000-(a[6]-48)*100-(a[7]-48)*10;	a[8]=a[8]+48;
		a[9]=-kq/10-(a[1]-48)*10000000-(a[2]-48)*1000000-(a[3]-48)*100000-(a[5]-48)*10000-(a[6]-48)*1000-(a[7]-48)*100-(a[8]-48)*10;	a[9]=a[9]+48;
		a[10]=-kq-(a[1]-48)*100000000-(a[2]-48)*10000000-(a[3]-48)*1000000-(a[5]-48)*100000-(a[6]-48)*10000-(a[7]-48)*1000-(a[8]-48)*100-(a[9]-48)*10;	a[10]=a[10]+48;
		return a;
	}
}

void Callback_Location(s32 result, ST_LocInfo* loc_info)
{
	s32 i;
	for(i=0;i<11;i++){
		curr_Lat[i]=*(FloatToString(loc_info->latitude)+i);
		curr_Long[i]=*(FloatToString(loc_info->longitude)+i);
	}
	APP_DEBUG("curr_Lat : %s \r\n",curr_Lat);
	APP_DEBUG("curr_Long : %s \r\n",curr_Long);
	Get_Timestamp();
//	BT_COM_Demo();
}

void Get_Timestamp(void)
{
	APP_DEBUG("Get Time \r\n");
    ST_Time SysTime;
	Ql_memset(&SysTime, 0, sizeof(SysTime));
	Ql_GetLocalTime(&SysTime);
	APP_DEBUG("Current Time :\r\n%02d/%02d/%02d %02d:%02d:%02d\r\n",SysTime.year, SysTime.month, SysTime.day, SysTime.hour, SysTime.minute, SysTime.second);
	timestamp[0]=(SysTime.year/1000) + 48;
	timestamp[1]=(SysTime.year/100)-(SysTime.year/1000)*10 + 48;
	timestamp[2]=(SysTime.year/10)-(SysTime.year/1000)*100-((SysTime.year/100)-(SysTime.year/1000)*10)*10 + 48;
	timestamp[3]=SysTime.year - (SysTime.year/10)*10 + 48;
	timestamp[4]='/';
	timestamp[5]=SysTime.month/10 +48;
	timestamp[6]=SysTime.month%10 +48;
	timestamp[7]='/';
	timestamp[8]=SysTime.day/10 +48;
	timestamp[9]=SysTime.day%10 +48;
	timestamp[10]=' ';
	timestamp[11]=SysTime.hour/10 +48;
	timestamp[12]=SysTime.hour%10 +48;
	timestamp[13]=':';
	timestamp[14]=SysTime.minute/10 +48;
	timestamp[15]=SysTime.minute%10 +48;
	timestamp[16]=':';
	timestamp[17]=SysTime.second/10 +48;
	timestamp[18]=SysTime.second%10 +48;
	APP_DEBUG("<-- timestamp : %s --> \r\n",timestamp);
	BT_COM_Demo();
}

void HTTP_Program()
{
    RIL_NW_SetGPRSContext(Ql_GPRS_GetPDPContextId()); //Set GPRS PDP context
    RIL_NW_SetAPN(1, APN, USERID, PASSWD); // Set APN
    RIL_NW_OpenPDPContext(); // Active PDP context
    RIL_HTTP_SetServerURL(HTTP_URL_ADDR, Ql_strlen(HTTP_URL_ADDR));// Set HTTP server address
    RIL_HTTP_RequestToPost(HTTP_POST_MSG, Ql_strlen(HTTP_POST_MSG));// Send post-request
    APP_DEBUG("<-- Send post-request, postMsg=%s -->\r\n", HTTP_POST_MSG);
 }



void BT_Callback(s32 event, s32 errCode, void* param1, void* param2)
{
    ST_BT_BasicInfo *pstNewBtdev = NULL;
    ST_BT_BasicInfo *pstconBtdev = NULL;
    s32 ret = RIL_AT_SUCCESS;
    s32 connid = -1;
    switch(event)
    {
        case MSG_BT_SCAN_IND : // MC60 scan
            if(URC_BT_SCAN_FINISHED== errCode) // scan finished
            {
                APP_DEBUG("Scan is over.\r\n");
                APP_DEBUG("Pair/Connect if need.\r\n");
                RIL_BT_GetDevListInfo();
                ret=RIL_BT_PairReq(0x80a8f310);// MC60 gui yeu cau ket noi
            }
            if(URC_BT_SCAN_FOUND == errCode)// MC60 chi ra nhung thiet bi bluetooth xung quanh
            {
                pstNewBtdev = (ST_BT_BasicInfo *)param1;
                APP_DEBUG("BTHdl[0x%08x] Addr[%s] Name[%s]\r\n",pstNewBtdev->devHdl,pstNewBtdev->addr,pstNewBtdev->name);
            }
            break;
         case MSG_BT_PAIR_IND : // MC60 gui yeu cau ket noi toi thiet bi khac
                    pstconBtdev = (ST_BT_BasicInfo*)param1;
                    APP_DEBUG("Pair device BTHdl: 0x%08x\r\n",pstconBtdev->devHdl);
                    APP_DEBUG("Pair device addr: %s\r\n",pstconBtdev->addr);
                    APP_DEBUG("Waiting for pair confirm with pinCode...\r\n");
                    char strAT1[20] = {0};
                    Ql_sprintf(strAT1, "AT+QBTPAIRCNF=%d,\"%s\"", 1, "1111");// password of module HC05 : 1111
                    Ql_RIL_SendATCmd(strAT1, Ql_strlen(strAT1), NULL, NULL, 0);
            break;
         case MSG_BT_PAIR_CNF_IND : // MC60 confirm connect
                pstconBtdev = (ST_BT_BasicInfo*)param1;
                APP_DEBUG("Paired successful.\r\n");//ok
                RIL_BT_ConnReq(0x80a8f310,0,1);// devHdl of HC05: 0x80a8f310
            break;
         case MSG_BT_SPP_CONN_IND : // connect serial port profile
                Ql_memcpy(&(BTSppDev1.btDevice),(ST_BT_BasicInfo *)param1,sizeof(ST_BT_BasicInfo));
                APP_DEBUG("Connect successful.\r\n");
                RIL_BT_SPP_Send(0x80a8f310,SppSendBuff,5,NULL); // SendDataLen: 5; devHdl of HC05: 0x80a8f310
              break;
         case MSG_BT_RECV_IND : //MC60 receive data from HC05
             connid = *(s32 *)param1;
             pstconBtdev = (ST_BT_BasicInfo *)param2;
             Ql_memcpy(&pSppRecHdl,pstconBtdev,sizeof(pSppRecHdl));
             APP_DEBUG("SPP receive data from BTHdl[0x%08x].\r\n",pSppRecHdl.devHdl);
             ret=RIL_BT_SPP_Read(0x80a8f310,SppReceiverBuff,4,NULL);  //ReceiDataLen:4 ; devHdl of HC05: 0x80a8f310
             APP_DEBUG("DATA : %s \r\n",SppReceiverBuff);
             curr_Temp[0]=SppReceiverBuff[0];
             curr_Temp[1]=SppReceiverBuff[1];
             curr_Humid[0]=SppReceiverBuff[2];
             curr_Humid[1]=SppReceiverBuff[3];
             APP_DEBUG("curr_Temp : %s \r\n",curr_Temp);
             APP_DEBUG("curr_Humid : %s \r\n",curr_Humid);
             msg_create(devid,packeid,timestamp, curr_Temp, curr_Humid,curr_Lat,curr_Long,"true",HTTP_POST_MSG);
             HTTP_Program();
             RIL_BT_Unpair(0x80a8f310);
             RIL_BT_Disconnect(0x80a8f310);

//             APP_DEBUG("<--Q1_Sleep-->\r\n");
//             Ql_Sleep(10000); //10s
//             APP_DEBUG("<--Q1_Reset-->\r\n");
//             Ql_Reset(0);
             break;
       case  MSG_BT_DISCONN_IND :
             if(URC_BT_DISCONNECT_PASSIVE == errCode || URC_BT_DISCONNECT_POSITIVE == errCode)
             {
                APP_DEBUG("Disconnect ok!\r\n");
             }
          break;
        default :
            break;
    }
}

void BT_COM_Demo(void)
{
    s32 ret;
	s32 visb_mode = -1;

    RIL_BT_Switch(1);
    APP_DEBUG("BT device power on.\r\n");

    Ql_memset(bt_name,0,sizeof(bt_name));
    RIL_BT_GetName(bt_name,BT_NAME_LEN);
    APP_DEBUG("BT device name is: %s.\r\n",bt_name);

    ret = RIL_BT_Initialize(BT_Callback);
    APP_DEBUG("BT callback function register successful.\r\n");

    RIL_BT_GetVisble(&visb_mode);
	APP_DEBUG("BT visble mode is: %d.\r\n",visb_mode);

    ret = RIL_BT_StartScan(10, 0, 10);//scan 10s, max 10 devices
    APP_DEBUG("BT scanning device...\r\n");
}

#endif // __EXAMPLE_LOCATION__
