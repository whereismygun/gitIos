//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "AppDelegate+XKHLaunch.h"
#import "XHLaunchAd.h"
#import "NetworkTool.h"
#import "LaunchAdModel.h"
#import "NFNetworkHelper.h"
#import "PublicDefine.h"
#import "AdModel.h"


@interface AppDelegate()<XHLaunchAdDelegate>

@end

@implementation AppDelegate (XHLaunchAd)
-(void)launchImageAndVideo
{
    //    视频下载检测wifi 下载
    //AAA 同时加载网络数据 视频 或者 图片 GIF
    
    [self launchImageAndVideo_networkData];
  
//      [self exampleVideo_networkData];

}

#pragma mark - 加载网络请求
-(void)launchImageAndVideo_networkData{
    
       [XHLaunchAd setWaitDataDuration:3];
    
        NSMutableDictionary *dicParam = [NSMutableDictionary dictionaryWithCapacity:9];
        [dicParam setValue:@"5" forKey:@"type"];
    //    [dicParam addEntriesFromDictionary:[KeepAppBox getHeaderParameter]];
    //    NSString *sign;
    //    sign  = [KeepAppBox createMd5Sign:dict];
    //    [dicParam setValue:sign forKey:@"sign"];
    
    [NetworkTool getInfoWithParameters:dicParam setupUrl:getApiHomeBannerURL success:^(NSDictionary *response) {
    
        //如果是图片或者GIF标志 需要缓存图片
        if ([response[@"data"] isKindOfClass:[NSDictionary class]] && [response[@"data"][@"type"] isEqualToString:@"img"]) {
            //1.图片开屏广告
            
            [self exampleImage_networkData:response];
            
        }else{
            //如果是视频 需要缓存视频到本地
          
            [self getCurrentNetworkStatues:response];
      
         }
    } failure:^(NSError *error) {
        
    }];

}


#pragma mark - 实时监测网络状态

-(void)getCurrentNetworkStatues:(NSDictionary*)data{
    
        [NFNetworkHelper networkStatusWithBlock:^(NFNetworkStatusType networkStatus) {
            switch (networkStatus) {
                    // 未知网络
                case NFNetworkStatusUnknown:
                    // 无网络
                case NFNetworkStatusNotReachable:
                    break;
                    // 手机网络
                case NFNetworkStatusReachableViaWWAN:
                    // 无线网络
                case NFNetworkStatusReachableViaWiFi:
                    
                    //wifi 网络时加载视频
                    //2.视频开屏广告
                    [self exampleVideo_networkData:data];
                    break;
            }
          [self exampleVideo_networkData:data];
            
        }];
  
}

#pragma mark - 加载图片
-(void)exampleImage_networkData:(NSDictionary*)data{
    
    LaunchAdModel *model = [[LaunchAdModel alloc] initWithDict:data[@"data"]];

    XHLaunchImageAdConfiguration *imageAdconfiguration = [XHLaunchImageAdConfiguration new];
    imageAdconfiguration.duration = model.duration;
    //广告frame
    imageAdconfiguration.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.width/model.width*model.height);
    imageAdconfiguration.imageNameOrURLString = model.content;
    imageAdconfiguration.imageOption          = XHLaunchAdImageDefault;
    imageAdconfiguration.contentMode          = UIViewContentModeScaleToFill;
    imageAdconfiguration.openURLString        = model.openUrl;
    imageAdconfiguration.showFinishAnimate    =ShowFinishAnimateFadein;
    imageAdconfiguration.customSkipView       = [self customSkipView];
    imageAdconfiguration.showEnterForeground  = NO;
 
    //显示开屏广告
    [XHLaunchAd imageAdWithImageAdConfiguration:imageAdconfiguration delegate:self];
}

#pragma mark - 加载视频

-(void)exampleVideo_networkData:(NSDictionary*)data{
    
    LaunchAdModel *model = [[LaunchAdModel alloc] initWithDict:data[@"data"]];
    
    XHLaunchVideoAdConfiguration *videoAdconfiguration = [XHLaunchVideoAdConfiguration new];
    videoAdconfiguration.duration = model.duration;
    //广告frame
    videoAdconfiguration.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.width/model.width*model.height);
    videoAdconfiguration.videoNameOrURLString   = model.content;
    videoAdconfiguration.openURLString          = model.openUrl;
    videoAdconfiguration.showFinishAnimate      =ShowFinishAnimateFadein;
    videoAdconfiguration.showEnterForeground    = NO;
    
    videoAdconfiguration.customSkipView         = [self customSkipView];
    
    //视频已缓存
    if([XHLaunchAd checkVideoInCacheWithURL:[NSURL URLWithString:model.content]])
    {
        //设置要添加
        videoAdconfiguration.subViews = [self launchAdSubViews_soundButton];
    }
    
    [XHLaunchAd videoAdWithVideoAdConfiguration:videoAdconfiguration delegate:self];
}


-(NSArray<UIView *> *)launchAdSubViews_soundButton{
    
    UIButton *voiceButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [voiceButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    voiceButton.titleLabel.font     = [UIFont systemFontOfSize:14];
    voiceButton.frame = CGRectMake(30,40, 20, 20);
    voiceButton.selected = NO;
    voiceButton.layer.cornerRadius   = 5.0;
    voiceButton.layer.borderColor     = [UIColor lightGrayColor].CGColor;
    [voiceButton setBackgroundImage:[UIImage imageNamed:@"blanknote_helight"] forState:UIControlStateNormal];
    [voiceButton setBackgroundImage:[UIImage imageNamed:@"blanknote_normal"] forState:UIControlStateSelected];
    voiceButton.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.5];
    [voiceButton addTarget:self action:@selector(addSoundButton:) forControlEvents:UIControlEventTouchUpInside];
    
    return [NSArray arrayWithObject:voiceButton];
}

//点击关闭声音
-(void)addSoundButton:(UIButton*)button{
    
    if (button.selected) {
        //点击了 关闭
        [XHLaunchAd soundAction:1];
        
    }else{
        //点击了 打开
        [XHLaunchAd soundAction:0];
        
    }
    
    button.selected = !button.selected;
    
}

#pragma mark - customSkipView
//自定义跳过按钮
-(UIView *)customSkipView
{
    UIButton *customButton = [UIButton buttonWithType:UIButtonTypeCustom];
    customButton.layer.cornerRadius  = 6.0;
    customButton.titleLabel.font     = [UIFont systemFontOfSize:14];
    customButton.backgroundColor     =[UIColor colorWithRed:0 green:0 blue:0 alpha:0.4];
    customButton.layer.borderColor   = [UIColor lightGrayColor].CGColor;
    [customButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    customButton.frame = CGRectMake(SCREEN_WIDTH-100,SCREEN_HEIGHT-200, 85, 40);
    [customButton addTarget:self action:@selector(skipAction) forControlEvents:UIControlEventTouchUpInside];
    return customButton;
}
//跳过按钮点击事件
-(void)skipAction
{
    [XHLaunchAd skipAction];
}
#pragma mark - XHLaunchAd delegate - 倒计时回调
/**
 *  倒计时回调
 *  @param launchAd XHLaunchAd
 *  @param duration 倒计时时间
 */
-(void)xhLaunchAd:(XHLaunchAd *)launchAd customSkipView:(UIView *)customSkipView duration:(NSInteger)duration
{
    //设置跳过按钮时间
    UIButton *button = (UIButton *)customSkipView;
    //设置时间
    [button setTitle:[NSString stringWithFormat:@"跳过 %lds",duration] forState:UIControlStateNormal];
}
#pragma mark - XHLaunchAd delegate - 其他

/**
 *  广告点击事件 回调
 */
- (void)xhLaunchAd:(XHLaunchAd *)launchAd clickAndOpenURLString:(NSString *)openURLString;
{
    NSLog(@"广告点击跳转到RN APP内部RN界面");
    

    
}
/**
 *  图片本地读取/或下载完成回调
 *
 *  @param launchAd XHLaunchAd
 *  @param image    image
 */
-(void)xhLaunchAd:(XHLaunchAd *)launchAd imageDownLoadFinish:(UIImage *)image
{
    NSLog(@"图片下载完成/或本地图片读取完成回调");
}
/**
 *  视频本地读取/或下载完成回调
 *
 *  @param launchAd XHLaunchAd
 *  @param pathURL  视频保存在本地的path
 */
-(void)xhLaunchAd:(XHLaunchAd *)launchAd videoDownLoadFinish:(NSURL *)pathURL
{
    NSLog(@"video下载/加载完成/保存path = %@",pathURL.absoluteString);
}

/**
 *  视频下载进度回调
 */
-(void)xhLaunchAd:(XHLaunchAd *)launchAd videoDownLoadProgress:(float)progress total:(unsigned long long)total current:(unsigned long long)current
{
    NSLog(@"总大小=%lld,已下载大小=%lld,下载进度=%f",total,current,progress);
    
}
/**
 *  广告显示完成
 */
-(void)xhLaunchShowFinish:(XHLaunchAd *)launchAd
{
    NSLog(@"广告显示完成");
    
}

@end
