################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../example/Example_gps_iic.c \
../example/bluetooth_test.c \
../example/example_ATCOMMAND.c \
../example/example_HTTP_GET.c \
../example/example_adc.c \
../example/example_alarm.c \
../example/example_audio.c \
../example/example_ble.c \
../example/example_bluetooth.c \
../example/example_bluetooth_nhan.c \
../example/example_call.c \
../example/example_clk.c \
../example/example_csd.c \
../example/example_download_epo.c \
../example/example_dtmf.c \
../example/example_eint.c \
../example/example_file.c \
../example/example_float_math.c \
../example/example_fota_ftp.c \
../example/example_fota_http.c \
../example/example_ftp.c \
../example/example_gpio.c \
../example/example_gps.c \
../example/example_http.c \
../example/example_http_post.c \
../example/example_iic.c \
../example/example_memory.c \
../example/example_multitask.c \
../example/example_multitask_port.c \
../example/example_pwm.c \
../example/example_sms.c \
../example/example_spi.c \
../example/example_system.c \
../example/example_tcp_demo.c \
../example/example_tcpclient.c \
../example/example_tcpserver.c \
../example/example_test_gps_and_post_2.c \
../example/example_time.c \
../example/example_timer.c \
../example/example_transpass.c \
../example/example_udpclient.c \
../example/example_udpserver.c \
../example/example_watchdog.c \
../example/location.c \
../example/main_tracking.c \
../example/nema_pro.c \
../example/utility.c 

OBJS += \
./example/Example_gps_iic.o \
./example/bluetooth_test.o \
./example/example_ATCOMMAND.o \
./example/example_HTTP_GET.o \
./example/example_adc.o \
./example/example_alarm.o \
./example/example_audio.o \
./example/example_ble.o \
./example/example_bluetooth.o \
./example/example_bluetooth_nhan.o \
./example/example_call.o \
./example/example_clk.o \
./example/example_csd.o \
./example/example_download_epo.o \
./example/example_dtmf.o \
./example/example_eint.o \
./example/example_file.o \
./example/example_float_math.o \
./example/example_fota_ftp.o \
./example/example_fota_http.o \
./example/example_ftp.o \
./example/example_gpio.o \
./example/example_gps.o \
./example/example_http.o \
./example/example_http_post.o \
./example/example_iic.o \
./example/example_memory.o \
./example/example_multitask.o \
./example/example_multitask_port.o \
./example/example_pwm.o \
./example/example_sms.o \
./example/example_spi.o \
./example/example_system.o \
./example/example_tcp_demo.o \
./example/example_tcpclient.o \
./example/example_tcpserver.o \
./example/example_test_gps_and_post_2.o \
./example/example_time.o \
./example/example_timer.o \
./example/example_transpass.o \
./example/example_udpclient.o \
./example/example_udpserver.o \
./example/example_watchdog.o \
./example/location.o \
./example/main_tracking.o \
./example/nema_pro.o \
./example/utility.o 

C_DEPS += \
./example/Example_gps_iic.d \
./example/bluetooth_test.d \
./example/example_ATCOMMAND.d \
./example/example_HTTP_GET.d \
./example/example_adc.d \
./example/example_alarm.d \
./example/example_audio.d \
./example/example_ble.d \
./example/example_bluetooth.d \
./example/example_bluetooth_nhan.d \
./example/example_call.d \
./example/example_clk.d \
./example/example_csd.d \
./example/example_download_epo.d \
./example/example_dtmf.d \
./example/example_eint.d \
./example/example_file.d \
./example/example_float_math.d \
./example/example_fota_ftp.d \
./example/example_fota_http.d \
./example/example_ftp.d \
./example/example_gpio.d \
./example/example_gps.d \
./example/example_http.d \
./example/example_http_post.d \
./example/example_iic.d \
./example/example_memory.d \
./example/example_multitask.d \
./example/example_multitask_port.d \
./example/example_pwm.d \
./example/example_sms.d \
./example/example_spi.d \
./example/example_system.d \
./example/example_tcp_demo.d \
./example/example_tcpclient.d \
./example/example_tcpserver.d \
./example/example_test_gps_and_post_2.d \
./example/example_time.d \
./example/example_timer.d \
./example/example_transpass.d \
./example/example_udpclient.d \
./example/example_udpserver.d \
./example/example_watchdog.d \
./example/location.d \
./example/main_tracking.d \
./example/nema_pro.d \
./example/utility.d 


# Each subdirectory must supply rules for building sources it contributes
example/%.o: ../example/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: ARM Windows GCC C Compiler (Sourcery Lite Bare)'
	arm-none-eabi-gcc -D__OCPU_COMPILER_GCC__ -D__CUSTOMER_CODE__ -I"${GCC_PATH}\arm-none-eabi\include" -I"C:\Program Files (x86)\Dev-Cpp\MinGW64" -I"C:\Program Files (x86)\Dev-Cpp\Templates" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\driver" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\include" -I"C:\Program Files (x86)\Dev-Cpp" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\ril\inc" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\custom\config" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\custom\fota\inc" -O2 -Wall -std=c99 -c -fmessage-length=0 -mlong-calls -Wstrict-prototypes -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -march=armv5te -mthumb-interwork -mfloat-abi=soft -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


