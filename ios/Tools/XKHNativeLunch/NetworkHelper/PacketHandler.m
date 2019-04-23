//
//  PacketHander.m
//  JiXingWang
//
//  Created by apple on 16/3/28.
//  Copyright © 2016年 apple. All rights reserved.
//


#import "PacketHandler.h"

//正式服务器
#define kServiceIP @"https://m.tongtongli.com"



#pragma mark 
//版本升级服务地址
NSString            *const updateVersionURL = @"" kServiceIP"/common/version";

//首页广告
NSString            *const getApiHomeBannerURL =@"" kServiceIP"/banner/indexBanner.json";


@implementation PacketHandler

@end
