/*
 * bluetooth_test.c
 *
 *  Created on: May 28, 2018
 *      Author: nhan
 */



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

static ST_BT_DevInfo **g_dev_info = NULL;

static void CallBack_UART_Hdlr(Enum_SerialPort port, Enum_UARTEventType msg, bool level, void* customizedPara)
{

}

void proc_main_task(s32 taskId)
{
    s32 ret;
    ST_MSG msg;

    // Register & open UART port
    Ql_UART_Register(UART_PORT1, CallBack_UART_Hdlr, NULL);
    Ql_UART_Open(UART_PORT1, 115200, FC_NONE);

    Ql_UART_Register(UART_PORT2, CallBack_UART_Hdlr, NULL);
    Ql_UART_Open(UART_PORT2, 115200, FC_NONE);
    APP_DEBUG("\r\n<-- OpenCPU test15: Bluetooth Test Example -->\r\n");

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
                        APP_DEBUG("<-- Functions are here -->\r\n");

                        ret = RIL_BT_Switch(1);
                        if(RIL_AT_SUCCESS != ret)
                        {
                             APP_DEBUG("BT power on failed,ret=%d.\r\n",ret);
                             return;
                        }
                        APP_DEBUG("BT device power on.\r\n");

                        char bt_name[10];
                        Ql_memset(bt_name,0,sizeof(bt_name));
                        ret = RIL_BT_GetName(bt_name,15);
                        if(RIL_AT_SUCCESS != ret)
                        {
                            APP_DEBUG("Get BT device name failed.\r\n");
                            return;
                        }
                        APP_DEBUG("BT device name is: %s.\r\n",bt_name);

                        ret = RIL_BT_StartScan(20,0,10);//scan 10s, maximum 20 device
                            if(RIL_AT_SUCCESS != ret)
                            {
                                APP_DEBUG("BT scan failed.\r\n");
                                return;
                            }
                            APP_DEBUG("BT scanning device...\r\n");
                            ST_BT_BasicInfo *pstNewBtdev = NULL;
                            ST_BT_BasicInfo *pstconBtdev = NULL;
                            g_dev_info = RIL_BT_GetDevListPointer();
                            RIL_BT_GetDevListInfo();
//                            pstNewBtdev = (ST_BT_BasicInfo *)param1;
                            APP_DEBUG("BTHdl[0x%08x] Addr[%s] Name[%s]\r\n",pstNewBtdev->devHdl,pstNewBtdev->addr,pstNewBtdev->name);







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



#endif // __EXAMPLE_LOCATION__

