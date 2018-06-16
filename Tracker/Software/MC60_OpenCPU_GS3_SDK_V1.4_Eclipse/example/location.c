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

/****************************************************************************
* Definition for APN
****************************************************************************/
#define APN      "CMNET\0"
#define USERID   ""
#define PASSWD   ""

static u32  TIMER_ID_WTD1 = 0x102;

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

static void CallBack_UART_Hdlr(Enum_SerialPort port, Enum_UARTEventType msg, bool level, void* customizedPara)
{
     
}
static void Location_Program(void);
static void Callback_Location(s32 result,ST_LocInfo* loc_info);
void callback_onTimer(u32 timerId, void* param);

/************************************************************************/
/*                                                                      */
/* The entrance to application, which is called by bottom system.       */
/*                                                                      */
/************************************************************************/
void proc_main_task(s32 taskId)
{
    ST_MSG msg;

   ///
    s32 wtdId;
    //Init watchdog, GPIO0, 1s interval for external watchdog (suppose that the overflow-timer of external  watchdog is 1.6s).
    Ql_WTD_Init(1, PINNAME_GPIO0, 1000);
    //Start a logic watchdog service in main task, the max. interval is 5s wtdId = Ql_WTD_Start(5*1000);
    //Register & start a timer to feed the logic watchdog.
    Ql_Timer_Register(TIMER_ID_WTD1, callback_onTimer, & wtdId);
    Ql_Timer_Start(TIMER_ID_WTD1, 3000, TRUE); //The real feeding interval is 3s
//
    // Register & open UART port
    Ql_UART_Register(UART_PORT1, CallBack_UART_Hdlr, NULL);
    Ql_UART_Open(UART_PORT1, 115200, FC_NONE);

    APP_DEBUG("\r\n<-- OpenCPU: Demo for Program Location -->\r\n");
//    Location_Program();
    while (TRUE)
    {
         Ql_OS_GetMessage(&msg);
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

static void Location_Program(void)
{
   u8  pdpCntxtId;
   Ql_GPRS_GetPDPContextId();
   RIL_NW_SetGPRSContext(pdpCntxtId);
   RIL_NW_SetAPN(1, APN, USERID, PASSWD);
   APP_DEBUG("<--Ql_Getlocation-->\r\n");
   RIL_GetLocation(Callback_Location);

}

void Callback_Location(s32 result, ST_LocInfo* loc_info)
{
    APP_DEBUG("\r\n<-- Module location: latitude=%f, longitude=%f -->\r\n", loc_info->latitude, loc_info->longitude);
}

void callback_onTimer(u32 timerId, void* param)
{
	Ql_WTD_Feed(*((s32*)param));
}

#endif // __EXAMPLE_LOCATION__
