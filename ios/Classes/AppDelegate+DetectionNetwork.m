//
//  AppDelegate+DetectionNetwork.m
//  ttl
//
//  Created by why on 2018/3/6.
//  Copyright © 2018年 why. All rights reserved.
//

#import "AppDelegate+DetectionNetwork.h"
#import "AFNetworking.h"
#import <AdSupport/AdSupport.h>
#import "AppDelegate.h"
#import "SSKeychain.h"



@implementation AppDelegate (DetectionNetwork)


-(void)DetectionNetwork{
    
    AFNetworkReachabilityManager *manager = [AFNetworkReachabilityManager sharedManager];
    [manager startMonitoring];
    [manager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        
        switch (status) {
            case AFNetworkReachabilityStatusUnknown:
            {
                // 位置网络
                NSLog(@"位置网络");
            }
                break;
            case AFNetworkReachabilityStatusNotReachable:
            {
                // 无法联网
                
               [self setNetworkState:NO];
            }
                break;
            case AFNetworkReachabilityStatusReachableViaWiFi:
            {
                // 手机自带网络
                  [self checkNeedSender];
                 [self setNetworkState:YES];
                NSLog(@"当前使用的是wifi网络");
         
            }
                break;
            case AFNetworkReachabilityStatusReachableViaWWAN:
            {
                // WIFI
                   [self checkNeedSender];
                   [self setNetworkState:YES];
                NSLog(@"当前在wwan网络下");
               
            }
        }
    }];
}


-(void)senderIDFA{
    
    NSString *IDFA =[[[ASIdentifierManager sharedManager]advertisingIdentifier]UUIDString];
  
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  
  [manager GET:@"https://m.tongtongli.com//ttlc/callback.json" parameters:@{@"idfa":IDFA,@"vision":@"rn"} progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSLog(@"%@",responseObject);
     
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    
   }];

}

//** 当前网络状态 */
-(void)setNetworkState:(BOOL)state{
    
  [[NSUserDefaults standardUserDefaults]setObject:[NSNumber numberWithBool:state] forKey:@"Reachability"];
    
}
- (void)checkNeedSender{

    if ([self isFirstInstall]) {

        [self senderIDFA];
    }

  
}



-(BOOL)isFirstInstall{
    
    
    NSString*isFirst=[SSKeychain passwordForService:@"com.RNTTL.TTJR" account:@"RNinstall"];
    
    if ([isFirst isEqualToString:@"installed"]) {
        return NO;
    }else{
        [SSKeychain setPassword:@"installed"
                     forService:@"com.RNTTL.TTJR"account:@"RNinstall"];
        return YES;
    }

}




-(BOOL)isFirstLauch{
    
    //获取当前版本号
    
    NSDictionary *infoDic = [[NSBundle mainBundle] infoDictionary];
    
    NSString *currentAppVersion = infoDic[@"CFBundleShortVersionString"];
    
    //获取上次启动应用保存的appVersion
    
    NSString *version = [[NSUserDefaults standardUserDefaults] objectForKey:@"AppVersion"];
    
    //版本升级或首次登录
    if (version == nil || ![version isEqualToString:currentAppVersion]) {
        
        [[NSUserDefaults standardUserDefaults] setObject:currentAppVersion forKey:@"AppVersion"];
        
        [[NSUserDefaults standardUserDefaults] synchronize];
        
        return YES;
    }else{
        return NO;
    }
}

@end
