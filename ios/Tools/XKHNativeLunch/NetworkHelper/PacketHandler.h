//
//  PacketHander.h
//  JiXingWang
//
//  Created by apple on 16/3/24.
//  Copyright © 2016年 apple. All rights reserved.
//

#import <Foundation/Foundation.h>

/*********此处存放所有功能的网络请求地址********/

#pragma mark - 首页相关URL
//版本升级服务地址
FOUNDATION_EXPORT                   NSString                *const updateVersionURL;

//首页广告
FOUNDATION_EXPORT                   NSString                *const getApiHomeBannerURL;



@interface PacketHandler : NSObject

@end
