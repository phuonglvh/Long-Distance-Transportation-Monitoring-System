################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.init

RM := cs-rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include ril/src/subdir.mk
-include example/subdir.mk
-include custom/fota/src/subdir.mk
-include custom/config/subdir.mk
-include subdir.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(ASM_DEPS)),)
-include $(ASM_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
endif

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 
SECONDARY_FLASH += \
APPGS3MDM32A01.bin \

SECONDARY_LIST += \
APPGS3MDM32A01.lst \

SECONDARY_SIZE += \
APPGS3MDM32A01.siz \


# All Target
all: APPGS3MDM32A01.elf secondary-outputs

# Tool invocations
APPGS3MDM32A01.elf: $(OBJS) $(USER_OBJS)
	@echo 'Building target: $@'
	@echo 'Invoking: ARM Windows GCC C Linker (Sourcery Lite Bare)'
	arm-none-eabi-gcc -T"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\libs\gcc\linkscript.ld" -nostartfiles -Xlinker --gc-sections -L"E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\libs\gcc" -L"${GCC_PATH}\arm-none-eabi\lib\thumb" -L"${GCC_PATH}\lib\gcc\arm-none-eabi\4.7.2\thumb" -Wl,-Map,"APPGS3MDM32A01.map" -Rbuild -march=armv5te -mthumb-interwork -mfloat-abi=soft -g3 -o "APPGS3MDM32A01.elf" $(OBJS) $(USER_OBJS) $(LIBS)
	@echo 'Finished building target: $@'
	@echo ' '
	$(MAKE) --no-print-directory post-build

APPGS3MDM32A01.bin: APPGS3MDM32A01.elf
	@echo 'Invoking: ARM Windows GNU Create Flash Image (Sourcery Lite Bare)'
	arm-none-eabi-objcopy -O binary "APPGS3MDM32A01.elf"  "APPGS3MDM32A01.bin"
	@echo 'Finished building: $@'
	@echo ' '

APPGS3MDM32A01.lst: APPGS3MDM32A01.elf
	@echo 'Invoking: ARM Windows GNU Create Listing (Sourcery Lite Bare)'
	arm-none-eabi-objdump -h -S "APPGS3MDM32A01.elf" > "APPGS3MDM32A01.lst"
	@echo 'Finished building: $@'
	@echo ' '

APPGS3MDM32A01.siz: APPGS3MDM32A01.elf
	@echo 'Invoking: ARM Windows GNU Print Size (Sourcery Lite Bare)'
	arm-none-eabi-size  --format=berkeley "APPGS3MDM32A01.elf"
	@echo 'Finished building: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) $(EXECUTABLES)$(OBJS)$(SECONDARY_FLASH)$(SECONDARY_LIST)$(SECONDARY_SIZE)$(ASM_DEPS)$(S_UPPER_DEPS)$(C_DEPS) APPGS3MDM32A01.elf
	-@echo ' '

post-build:
	-copy /y E:\Do_an\MC60_document\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\MC60_OpenCPU_GS3_SDK_V1.4_Eclipse\libs\app_image_bin.cfg ${CWD}\app_image_bin.cfg
	-@echo ' '

secondary-outputs: $(SECONDARY_FLASH) $(SECONDARY_LIST) $(SECONDARY_SIZE)

.PHONY: all clean dependents
.SECONDARY: post-build

-include ../makefile.targets
