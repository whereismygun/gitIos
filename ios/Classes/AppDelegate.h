/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import "CustomNavigationController.h"
#import "JPUSHService.h"

//release
@interface AppDelegate : UIResponder <UIApplicationDelegate,JPUSHRegisterDelegate>


@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) UINavigationController* navController;
@property(nonatomic,assign) UIBackgroundTaskIdentifier bgTask;

+ (NSString*)getRNConfig:(NSString *)key;
+ (NSString*)getBundleVersion:(NSString *)key;
+ (void)setDeviceToken:(NSString *)dev;
+ (NSString*)getDeviceToken;
+ (BOOL)isFromCache;
+ (NSString*)getCachePath;
+ (BOOL)isFirstStart;


@end
