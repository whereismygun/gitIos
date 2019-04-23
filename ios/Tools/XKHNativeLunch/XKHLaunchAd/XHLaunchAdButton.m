//
//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "XHLaunchAdButton.h"


@interface XHLaunchAdButton()

@property(nonatomic,assign)SkipType skipType;

@end

@implementation XHLaunchAdButton

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
        self.frame = frame;
        self.timeLab = [[UILabel alloc] initWithFrame:self.bounds];
        self.timeLab.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.4];
        [self timeLabcornerRadiusWithFrame:self.timeLab.frame];
        self.timeLab.textColor = [UIColor whiteColor];
        self.timeLab.layer.masksToBounds = YES;
        self.timeLab.textAlignment = NSTextAlignmentCenter;
        self.timeLab.font = [UIFont systemFontOfSize:13.5];
        [self addSubview:self.timeLab];
        
    }
    return self;
}

-(void)setSkipType:(SkipType)skipType
{
    _skipType = skipType;
    
    switch (skipType) {
        case SkipTypeNone:
            
            self.hidden = YES;
            
            break;
        case SkipTypeTime:
            
            self.timeLab.text = [NSString stringWithFormat:@"跳过%d s",5];
            
            break;
        case SkipTypeText:
            
            self.timeLab.text = @"跳过";
            
            break;
            
        case SkipTypeTimeText:
            
            self.timeLab.text = [NSString stringWithFormat:@"%ds 跳过",5];
            
            break;
            
        default:
            break;
    }
}

-(void)stateWithskipType:(SkipType )skipType andDuration:(NSInteger)duration
{

    switch (skipType) {
        case SkipTypeNone:
            
            self.hidden = YES;
            
            break;
        case SkipTypeTime:
            
            self.hidden = NO;
            self.timeLab.text = [NSString stringWithFormat:@"跳过%lds",duration];
            
            break;
        case SkipTypeText:
            
             self.hidden = NO;
            self.timeLab.text = @"跳过";
            
            break;
            
        case SkipTypeTimeText:
            
             self.hidden = NO;
            self.timeLab.text = [NSString stringWithFormat:@"%lds 跳过",duration];
            
            break;
            
        default:
            break;
    }
}

-(void)setLeftRightSpace:(CGFloat)leftRightSpace
{
    _leftRightSpace = leftRightSpace;
    CGRect frame = self.timeLab.frame;
    CGFloat width = frame.size.width;
    if(leftRightSpace<=0 || leftRightSpace*2>= width) return;
    frame = CGRectMake(leftRightSpace, 0, width-2*leftRightSpace, frame.size.height);
    self.timeLab.frame = frame;
    [self timeLabcornerRadiusWithFrame:frame];
}
-(void)setTopBottomSpace:(CGFloat)topBottomSpace
{
    _topBottomSpace = topBottomSpace;
    CGRect frame = self.timeLab.frame;
    CGFloat height = frame.size.height;
    if(topBottomSpace<=0 || topBottomSpace*2>= height) return;
    frame = CGRectMake(0, topBottomSpace, frame.size.width, height-2*topBottomSpace);
    self.timeLab.frame = frame;
    [self timeLabcornerRadiusWithFrame:frame];

}
-(void)timeLabcornerRadiusWithFrame:(CGRect)frame
{
    CGFloat min = frame.size.height;
    if(frame.size.height>frame.size.width)
    {
        min = frame.size.width;
    }
    self.timeLab.layer.cornerRadius = min/2.0;
    self.timeLab.layer.masksToBounds = YES;
}


@end
