//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  数据请求类

#import <Foundation/Foundation.h>

#import "PacketHandler.h"
#import "NFNetworkHelper.h"


typedef void(^NetworkSucess) (NSDictionary * response);

typedef void(^NetworkFailure) (NSError *error);

typedef void(^NetworkRequestCache) (id responseCache);


typedef void (^RequestFinishedBlock) (id data, NSError *error);


@interface NetworkTool : NFNetworkHelper


+(void)getLaunchAdImageDataSuccess:(NetworkSucess)success failure:(NetworkFailure)failure;
+(void)getLaunchAdVideoDataSuccess:(NetworkSucess)success failure:(NetworkFailure)failure;




+ (NSURLSessionTask *)getInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success failure:(NetworkFailure)failure;

+ (NSURLSessionTask *)getInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success responseCache:(NetworkRequestCache)responseCache failure:(NetworkFailure)failure;

+ (NSURLSessionTask *)postInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success failure:(NetworkFailure)failure;

+ (NSURLSessionTask *)postInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success responseCache:(NetworkRequestCache)responseCache failure:(NetworkFailure)failure;


@end
