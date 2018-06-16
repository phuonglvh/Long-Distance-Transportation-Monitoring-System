################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../custom/fota/src/fota_ftp.c \
../custom/fota/src/fota_http.c \
../custom/fota/src/fota_http_code.c \
../custom/fota/src/fota_main.c 

OBJS += \
./custom/fota/src/fota_ftp.o \
./custom/fota/src/fota_http.o \
./custom/fota/src/fota_http_code.o \
./custom/fota/src/fota_main.o 

C_DEPS += \
./custom/fota/src/fota_ftp.d \
./custom/fota/src/fota_http.d \
./custom/fota/src/fota_http_code.d \
./custom/fota/src/fota_main.d 


# Each subdirectory must supply rules for building sources it contributes
custom/fota/src/%.o: ../custom/fota/src/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: ARM Windows GCC C Compiler (Sourcery Lite Bare)'
	arm-none-eabi-gcc -D__OCPU_COMPILER_GCC__ -D__CUSTOMER_CODE__ -I"${GCC_PATH}\arm-none-eabi-gcc\include" -I"${GCC_PATH}\arm-none-eabi-gcc\libc" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\include" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\ril\inc" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\custom\config" -I"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\custom\fota\inc" -O2 -Wall -std=c99 -c -fmessage-length=0 -mlong-calls -Wstrict-prototypes -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -march=armv5te -mthumb-interwork -mfloat-abi=soft -g3 -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


