//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>
#import <AVKit/AVKit.h>

@interface XHLaunchAdView : UIImageView

@property(nonatomic,copy) void(^adClick)();

@end

#pragma mark - imageAdView
@interface XHLaunchImageAdView : XHLaunchAdView


@end

#pragma mark - videoAdView
@interface XHLaunchVideoAdView : XHLaunchAdView

@property (nonatomic, assign) BOOL isPlaying;

// AVPlayer 控制视频播放
@property (nonatomic, strong) AVPlayer *player;

// 传入视频地址
- (void)updatePlayerWithURL:(NSURL *)url;

@end
