//
//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 *  倒计时类型
 */
typedef NS_ENUM(NSInteger,SkipType) {
    
    SkipTypeNone      = 1,//无
    SkipTypeTime      = 2,//倒计时
    SkipTypeText      = 3,//跳过
    SkipTypeTimeText  = 4,//倒计时+跳过
    
};

@interface XHLaunchAdButton : UIButton

@property(nonatomic,strong)UILabel *timeLab;
@property(nonatomic,assign)CGFloat leftRightSpace;
@property(nonatomic,assign)CGFloat topBottomSpace;

-(void)stateWithskipType:(SkipType)skipType andDuration:(NSInteger)duration;

@end
