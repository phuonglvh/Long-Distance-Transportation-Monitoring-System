/* Connect hardware
         HC05
     RXD ---- PB1
     TXD ---- PB0
     GND ---- GND
         DHT11
     VCC ---- VBUS
     GND ---- GND
     OUT ---- PD6
 */
#include <include.h>

//void Config_UART0(void);
void Config_UART1(void);
void UARTStringPut(uint32_t UART_, char *str);
void UART1IntHandler(void);
void Send_Temp_Humid_UART1(unsigned char sTemp, unsigned char sHumid);
void DHT_Request(void);
void DHT_Response(void);
uint8_t Checkbit(uint8_t tbit);
unsigned char DHT_Solution(void);

unsigned char bit[41];
unsigned char dht1x_temp, dht1x_rh, dht1x_checksum,Temp,Humid,dht1x_rh_dec,dht1x_temp_dec;
uint8_t state;
typedef  unsigned long int u_int;
    void Config_UART1(void){
        SysCtlPeripheralEnable(SYSCTL_PERIPH_UART1);
        SysCtlPeripheralEnable(SYSCTL_PERIPH_GPIOB);
        GPIOPinConfigure(GPIO_PB0_U1RX);
        GPIOPinConfigure(GPIO_PB1_U1TX);
        GPIOPinTypeUART(GPIO_PORTB_BASE, GPIO_PIN_0 | GPIO_PIN_1);
        UARTConfigSetExpClk(UART1_BASE, SysCtlClockGet(), 115200, (UART_CONFIG_WLEN_8 | UART_CONFIG_STOP_ONE | UART_CONFIG_PAR_NONE));
    }

    void UART1IntHandler(void)// Quet chuoi Sim900 nhan dc tu tin nhan dien thoat
    {
        uint32_t ui32Status;
        uint8_t c;
        ui32Status = UARTIntStatus(UART1_BASE, true); //get interrupt status
        UARTIntClear(UART1_BASE, ui32Status); //clear the asserted interrupts
        while(UARTCharsAvail(UART1_BASE)) //loop while there are chars
        {
            c = UARTCharGetNonBlocking(UART1_BASE);
            if (c == 'D')           state=1;
            else if (c == 'A' && state == 1) state = 2;
            else if (c == 'T' && state == 2) state = 3;
            else if (c == 'A' && state == 3) state = 4;
            else if (c == '?' && state == 4) state = 5;
        }
    }

    void UARTStringPut(uint32_t UART_, char *str){
               int i= 0;
               while (str[i]!=0){
                   UARTCharPut(UART_, str[i]);
                   i++;
               }
       }

    void DHT_Request(void){
        //clear data
        uint8_t ii;
        for (ii=0; ii< 41; ii++)
            *(bit + ii) = 0;
        // request reading
        SysCtlPeripheralEnable(SYSCTL_PERIPH_GPIOD);
        GPIOPinTypeGPIOOutput(GPIO_PORTD_BASE, GPIO_PIN_6);// set PA3 is output
        GPIOPinWrite(GPIO_PORTD_BASE, GPIO_PIN_6, 0<<6);
        SysCtlDelay((SysCtlClockGet()*12)/3000);//delay 12ms
        GPIOPinWrite(GPIO_PORTD_BASE, GPIO_PIN_6, 1<<6);
        GPIOPinTypeGPIOInput(GPIO_PORTD_BASE,GPIO_PIN_6);// set PA3 is input
        while(GPIOPinRead(GPIO_PORTD_BASE, GPIO_PIN_6)==GPIO_PIN_6);//doi data xuong 0
        while(GPIOPinRead(GPIO_PORTD_BASE, GPIO_PIN_6)==0);//doi data len 1
        while(GPIOPinRead(GPIO_PORTD_BASE, GPIO_PIN_6)==GPIO_PIN_6);//doi data xuong 0

    }


    void DHT_Response(void){
        uint8_t a,b;
        uint8_t idht;
        for(idht=1;idht<=40;idht++){
            a=Checkbit(0); //time of state 0
            b=Checkbit(GPIO_PIN_6);//time of state 1
            bit[idht]=(a<b);
//            if(a<b) bit[idht]=1;
//            else bit[idht]=0;
        }
    }

    uint8_t Checkbit(uint8_t tbit){// messure the time of states
        uint8_t tdelay=0;
        while((GPIOPinRead(GPIO_PORTD_BASE, GPIO_PIN_6)==tbit)&(tdelay<100)){
            tdelay++;
        }
        return tdelay;
    }

    unsigned char DHT_Solution(void)
    {

        DHT_Request();
        DHT_Response();
      dht1x_temp=0;
      dht1x_rh=0;
      dht1x_checksum=0;
      unsigned char i=0;
      for(i=1;i<9;i++){
        dht1x_rh=(dht1x_rh<<1)|bit[i];
      }
      for(i=9;i<17;i++)
        dht1x_rh_dec=(dht1x_rh_dec<<1)|bit[i];
      for(i=17;i<25;i++){
        dht1x_temp=(dht1x_temp<<1)|bit[i];
      }
      for(i=25;i<33;i++)
        dht1x_temp_dec=(dht1x_temp_dec<<1)|bit[i];
      for(i=33;i<41;i++){
        dht1x_checksum=(dht1x_checksum<<1)|bit[i];
      }
      if((dht1x_temp!=255)&(dht1x_rh!=0)&(dht1x_checksum==(dht1x_temp+dht1x_rh+dht1x_temp_dec+dht1x_rh_dec))) return 1;
      else return 0;
    }

    void Send_Temp_Humid_UART1(unsigned char sTemp, unsigned char sHumid){
        uint8_t t1,t2,h1,h2;
//        UARTStringPut(UART1_BASE,"Temp : ");
        t1=sTemp/10;    UARTCharPut(UART1_BASE, 48+t1);
        t2=sTemp%10;    UARTCharPut(UART1_BASE, 48+t2);
//        UARTStringPut(UART1_BASE,"\r\n");
//        UARTStringPut(UART1_BASE,"Humid : ");
        h1=sHumid/10;    UARTCharPut(UART1_BASE, 48+h1);
        h2=sHumid%10;    UARTCharPut(UART1_BASE, 48+h2);
//        UARTStringPut(UART1_BASE,"\r\n");
    }


void main(void) {

    SysCtlClockSet(SYSCTL_SYSDIV_4 | SYSCTL_USE_PLL | SYSCTL_OSC_MAIN | SYSCTL_XTAL_16MHZ);//50Mhz

    Config_UART1();
    IntMasterEnable();
    IntEnable(INT_UART1);
    UARTIntEnable(UART1_BASE, UART_INT_RX | UART_INT_RT);

    while(1){
        SysCtlDelay(SysCtlClockGet()/3);
        if(state==5){
            if(DHT_Solution()){
                Temp = dht1x_temp;
                Humid    = dht1x_rh;
            }
            if(Temp!=0 && Humid!=0)
                Send_Temp_Humid_UART1(Temp, Humid);
            else UARTStringPut(UART1_BASE, "DHT11 is not ready.\r\n");
            state=0;
        }
    }
}



