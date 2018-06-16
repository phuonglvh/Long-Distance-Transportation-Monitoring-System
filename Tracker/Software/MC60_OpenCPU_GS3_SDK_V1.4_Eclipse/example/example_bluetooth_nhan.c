//*****************************************************************************
/*  Copyright Statement:
*  --------------------
*  This software is protected by Copyright and the information contained
*  herein is confidential. The software may not be copied and the information
*  contained herein may not be used or disclosed except with the written
*  permission of Quectel Co., Ltd. 2014
*
*****************************************************************************/
/*****************************************************************************
*
* Filename:
* ---------
*   example_bluetooth.c
*
* Project:
* --------
*   OpenCPU
*
* Description:
* ------------
*   This example demonstrates how to program BLUETOOTH interface in OpenCPU.
*
*   All debug information will be output through DEBUG port.
*
* Usage:
* ------
*   Compile & Run:
*
*     Set "C_PREDEF=-D __EXAMPLE_BLUETOOTH__" in gcc_makefile file. And compile the
*     app using "make clean/new".
*     Download image bin to module to run.


    Description: There are two scenes in bluetooth application

    1.active side

      (1)power on module BT func
      (2)set a customized name for module BT
      (3)scan the bt devices around ,and device info will be indicated through URCS
      (4)choose one bt device to connect,if module has paired it before ,directly goes to step 7
      (5)for the first time to connect,you need to make a pair between module and BT device
      (6)while pair is established ,you need make a confirm for this pair
      (7)once the pair process is passed ,next goes to connection procedure,be aware of you connection mode
      (8)after connection,you can check the BT status of module
      (9)last step is to execute BT read/write operations

    2.passive side

      (1)power on module BT func
      (2)set a customized name for module BT
      (3)external BT devices make a attempt to connect module,specilized URCS will be reported to reflect
         the connection procedure
      (4)according to the specilized URCS ,we do different handles

NOTE:Current SDK is only support SPP mode ,so you can test this demo between two modules or with your phone by installing a
        BT-UART.apk in your phone side

  * If customer wants to run this example, the following steps should be followed:
      1. After the module powers on,demo will print module bt name ,visible mode and enter bt scan mode automatically(scan time is 40s in default)
      2. During the scan procedure,you can wait until scan finished or excute "stopscan" command to finish the scan manually
      3. After the scan finished,a device info table is prompted ,formated as below:
          DEVICEADDR    SCANID    DEVHANDLE   PAIRID   CONNID    PROFILEID    DEVICENAME
         33F09DCC6261      1      0x21945f74   -1         -1        -1           M66
          DEVICEADDR : the bt addr of the device
          SCANID:the scan id of the device ,0 represents scan finished
          DEVHANDLE : the hash value of the bt addr,is also unique
          PAIRID : the pair id of paired device (1-10),support 10 paired device at most,default is -1
          CONNID : the connect id of the connected device(0-2),default is -1
          PROFILEID : the profile type when connected(SPP for example),default is -1
          DEVICENAME : the bt name of the device
      4. So far ,you can take a review of the info table and decide which device to operate
      5. Using "pair=DEVHANDLE" to pair a device ,if you are using a phone ,you need to confirm the pair in your phone side
            and the module side is confirmed automatically
      6. You can use "query" command to query current bt state info at any point of the flow
      7. After paired ,you can use "unpair=DEVHANDLE"command to unpair the dedicated pair
      8. For paired items ,you can use "conn=DEVHANDLE,PROFILEID,MODE"to make a connect.PROFILEID sees emum Enum_BTProfileId
            and MODE sees Enum_BT_SPP_ConnMode
      9. Using "disc=DEVHANDLE" to disconnect a connection
      10.Using "send=DEVHANDLE,data"command to send the contents of data area to the dedicated bt device
      11.Using "read"command to recieve the data from connected bt device
      12.If another device make a connect request to module ,you should type "connaccept"command to accpet the connect request



*
* Author: Lebron Liu
* -------
* -------
*
*============================================================================
*             HISTORY
*----------------------------------------------------------------------------
*
****************************************************************************/

//#define __EXAMPLE_LOCATION__
#ifdef __EXAMPLE_LOCATION__
#include "ql_type.h"
#include "ql_trace.h"
#include "ql_uart.h"
#include "ril.h"
#include "ril_network.h"
#include "ril_location.h"
#include "ql_gprs.h"
#include "ql_stdlib.h"
#include "ql_error.h"

#include "ril_bluetooth.h"
#include "ql_system.h"

/****************************************************************************
* Definition for APN
****************************************************************************/
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

static char Temp[2];
static char Humi[2];

static char bt_name[BT_NAME_LEN]; // QUECTEL
static ST_BT_DevInfo **g_dev_info = NULL;
static u8 SppSendBuff[5]="DATA?";// data which MC60 send to HC05
static u8 SppReceiverBuff[30];
static ST_BT_BasicInfo pSppRecHdl;
static ST_BT_DevInfo BTSppDev1 = {0};

static void CallBack_UART_Hdlr(Enum_SerialPort port, Enum_UARTEventType msg, bool level, void* customizedPara);
static void BT_COM_Demo(void);
static void BT_Callback(s32 event, s32 errCode, void* param1, void* param2);
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
    ret = Ql_UART_Register(UART_PORT1, CallBack_UART_Hdlr, NULL);
    ret = Ql_UART_Open(UART_PORT1, 115200, FC_NONE);
    APP_DEBUG("\r\n<-- OpenCPU test 37: Bluetooth Test Example -->\r\n");
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
                case URC_SYS_INIT_STATE_IND:
                    if (SYS_STATE_SMSOK == msg.param2)
                    {
                    }
                    break;
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
                        APP_DEBUG("<-- test 1 Functions are here -->\r\n");
                        BT_COM_Demo();

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


static void CallBack_UART_Hdlr(Enum_SerialPort port, Enum_UARTEventType msg, bool level, void* customizedPara)
{
}

static void BT_Callback(s32 event, s32 errCode, void* param1, void* param2)
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
             Temp[0]=SppReceiverBuff[0];
             Temp[1]=SppReceiverBuff[1];
             Humi[0]=SppReceiverBuff[2];
             Humi[1]=SppReceiverBuff[3];
             APP_DEBUG("Temp : %s \r\n",Temp);
             APP_DEBUG("Humi : %s \r\n",Humi);
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

static void BT_COM_Demo(void)
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
