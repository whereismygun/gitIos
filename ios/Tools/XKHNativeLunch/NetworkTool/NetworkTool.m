//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//
//  数据请求类
#import "NetworkTool.h"
#import "NFNetworkHelper.h"

@implementation NetworkTool



+(void)getLaunchAdImageDataSuccess:(NetworkSucess)success failure:(NetworkFailure)failure;
{
        NSData *JSONData = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"LaunchImageAd" ofType:@"json"]];
        
        NSDictionary *json =  [NSJSONSerialization JSONObjectWithData:JSONData options:NSJSONReadingAllowFragments error:nil];
        if(success) success(json);

}

+(void)getLaunchAdVideoDataSuccess:(NetworkSucess)success failure:(NetworkFailure)failure;
{
    
        NSData *JSONData = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"LaunchVideoAd" ofType:@"json"]];
        NSDictionary *json =  [NSJSONSerialization JSONObjectWithData:JSONData options:NSJSONReadingAllowFragments error:nil];
        if(success) success(json);
        
}

+ (NSURLSessionTask *)getInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success failure:(NetworkFailure)failure{
    
    NSString *urlString = [url stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    return [NetworkTool GET:urlString parameters:parameters success:^(id responseObject) {
        
        success(responseObject);

    } failure:^(NSError *error) {
        failure(error);
    }];
}

+ (NSURLSessionTask *)postInfoWithParameters:(id)parameters setupUrl:(NSString *)url success:(NetworkSucess)success failure:(NetworkFailure)failure{
    
    NSString *urlString = [url stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    return [NetworkTool POST:urlString parameters:parameters success:^(id responseObject) {
        
        success(responseObject);
        
    } failure:^(NSError *error) {
        failure(error);
    }];
}



@end
