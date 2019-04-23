//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>

@interface NSString (XHLaunchAd)

@property(nonatomic,assign,readonly)BOOL xh_isURLString;

@property(nonatomic,copy,readonly,nonnull)NSString *xh_videoName;

@property(nonatomic,copy,readonly,nonnull)NSString *xh_md5String;

-(BOOL)xh_containsSubString:(nonnull NSString *)subString;

@end
