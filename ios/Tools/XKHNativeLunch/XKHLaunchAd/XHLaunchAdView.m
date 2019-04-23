//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "XHLaunchAdView.h"

@implementation XHLaunchAdView

- (instancetype)init
{
    self = [super init];
    if (self) {
        
       self.userInteractionEnabled = YES;
       self.frame = [UIScreen mainScreen].bounds;
    }
    return self;
}

-(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    if(self.adClick) self.adClick();
}
@end


#pragma mark - imageAdView
@implementation XHLaunchImageAdView


@end

#pragma mark - videoAdView

@interface XHLaunchVideoAdView ()
{
    AVPlayerItem *_playerItem;
    AVPlayerLayer *_playerLayer;
}

@end
@implementation XHLaunchVideoAdView

- (instancetype)init
{
    self = [super init];
    if (self) {
        
        // setAVPlayer
        self.player = [[AVPlayer alloc] init];
        _player.volume = 1.0; // 默认最大音量
        _playerLayer = [AVPlayerLayer playerLayerWithPlayer:_player];
        _playerLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
        [self.layer addSublayer:_playerLayer];
        
        [self addObserver:self forKeyPath:@"frame" options:NSKeyValueObservingOptionNew|NSKeyValueObservingOptionOld context:nil];
       
    }
    return self;
}


-(void)updatePlayerWithURL:(NSURL *)url{
    _playerItem = [AVPlayerItem playerItemWithURL:url]; //  item
    [_player  replaceCurrentItemWithPlayerItem:_playerItem]; // replaceCurrentItem
    
    [_player play];
    
    }

-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSString *,id> *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"frame"]) {
        
        _playerLayer.frame =  self.frame;
    }
    
}

@end
