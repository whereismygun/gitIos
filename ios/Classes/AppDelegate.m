/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


#import "RCTUpdater.h"
#import "AppDelegate.h"
#import "AppUpdater.h"
#import "AppUtils.h"

#import "LocalURLProtocol.h"
#import "MainViewController.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AudioToolbox/AudioToolbox.h>

#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "AppDelegate+XKHLaunch.h"
#import "AppDelegate+DetectionNetwork.h"
#import "JPUSHService.h"

// iOS10注册APNs所需头文件
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif


@implementation AppDelegate 


static NSString *device_token = nil;

static NSDictionary *rn_info = nil;

static NSDictionary *bundle_ver = nil;

static BOOL from_cache = NO;
static BOOL first=YES;
static NSString *build_path = nil;
static NSString *build_index_path = nil;
static NSString *build_assets_path = nil;
static NSString *build_meta_path = nil;

+ (NSString*)packageVersion {
  static NSString *version = nil;

  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSDictionary *infoDict = [[NSBundle mainBundle] infoDictionary];
    version = [infoDict objectForKey:@"CFBundleShortVersionString"];
  });
  return version;
}

- (id)init
{
  /** If you need to do any extra app-specific initialization, you can do it here
   *  -jm
   **/
  NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];

  [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];

  int cacheSizeMemory = 8 * 1024 * 1024; // 8MB
  int cacheSizeDisk = 64 * 1024 * 1024; // 64MB
#if __has_feature(objc_arc)
  NSURLCache* sharedCache = [[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"];
#else
  NSURLCache* sharedCache = [[[NSURLCache alloc] initWithMemoryCapacity:cacheSizeMemory diskCapacity:cacheSizeDisk diskPath:@"nsurlcache"] autorelease];
#endif
  [NSURLCache setSharedURLCache:sharedCache];

  //
  [NSURLProtocol registerClass:[LocalURLProtocol class]];

  // 加载rn配置
  [self initRNInfo];
  
  //** 检测网络状态 */
  [self DetectionNetwork];
  
  // 加载bundleVer
  [self initBundleVer];

  self = [super init];
  return self;
}


- (void)checkUpdate
{
  if (rn_info && bundle_ver) {
    AppUpdater *appUpdater = [AppUpdater alloc];
    NSMutableDictionary *appInfo = [[NSMutableDictionary alloc]initWithCapacity:4];
    [appInfo setValue:[rn_info objectForKey:@"appName"] forKey:@"appName"];
    [appInfo setValue:[rn_info objectForKey:@"appChannel"] forKey:@"appChannel"];
    [appInfo setValue:[AppDelegate packageVersion] forKey:@"appVersion"];
    [appInfo setValue:bundle_ver forKey:@"bundle"];
    [appInfo setValue:[NSNumber numberWithBool:from_cache] forKey:@"fromCache"];

    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_group_t group = dispatch_group_create();
    dispatch_group_async(group, queue, ^{
      [appUpdater checkAndUpdate:appInfo];
    });
  }
}



- (void)initRNInfo
{
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"rn" ofType:@"plist"];
  rn_info = [[NSDictionary alloc] initWithContentsOfFile:plistPath];
}

- (void)initBundleVer
{
  // 判断是否有最新版本
  NSFileManager *fm = [NSFileManager defaultManager];
  NSArray *pathCaches = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString *cachePath = [pathCaches objectAtIndex:0];
  build_path = [cachePath stringByAppendingString:@"/build"];
  build_index_path = [build_path stringByAppendingString:@"/index/index.jsbundle"];
  build_assets_path = [build_path stringByAppendingString:@"/assets"];
  build_meta_path = [build_path stringByAppendingString:@"/bundle-ver.meta"];

  NSString *bundleVerStr = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"bundle-ver" ofType:@"meta"] encoding:NSUTF8StringEncoding error:nil];
  bundle_ver = [NSJSONSerialization JSONObjectWithData:[bundleVerStr dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:nil];
  NSString *version = [bundle_ver objectForKey:@"v"];
  from_cache = NO;
  if ([fm fileExistsAtPath:build_path] && [fm fileExistsAtPath:build_index_path] && [fm fileExistsAtPath:build_assets_path] && [fm fileExistsAtPath:build_meta_path]) {
    NSString *cacheBundleVerStr = [NSString stringWithContentsOfFile:build_meta_path encoding:NSUTF8StringEncoding error:nil];
    NSDictionary *cacheBundleVer = [NSJSONSerialization JSONObjectWithData:[cacheBundleVerStr dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:nil];
    NSString *cacheVersion = [cacheBundleVer objectForKey:@"v"];
    if ([AppUtils compareVersion:version otherVersion:cacheVersion] < 0) {
      from_cache = YES;
      bundle_ver = cacheBundleVer;
    }
  }
}

- (NSURL*)getJsCodeLocation
{
  NSURL *jsCodeLocation;

#ifdef DEBUG

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

#else

  if (from_cache) {
    jsCodeLocation = [NSURL URLWithString:build_index_path];
  } else {
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"jsbundle"];
  }

#endif

  // 检查更新
  [self checkUpdate];

  return jsCodeLocation;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  NSURL *jsCodeLocation = [self getJsCodeLocation];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"TTLApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  MainViewController *rootViewController = [MainViewController new];
  rootViewController.view = rootView;

  self.navController = [[CustomNavigationController alloc] init];


  [self.navController pushViewController:rootViewController animated:YES];
  self.window.rootViewController = self.navController;
  
  
  [self launchImageAndVideo];

  [self.window makeKeyAndVisible];
  
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
  
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {

  }
  
  [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  [JPUSHService setupWithOption:launchOptions
                         appKey:[rn_info objectForKey:@"jpush"]
                         channel:@"AppStore"
                apsForProduction:YES];
  
  [JPUSHService setDebugMode];
  

  // Fabric
#ifdef DEBUG
  [[Fabric sharedSDK] setDebug: YES];
#endif
  [Fabric with:@[[Crashlytics class]]];
  

  return YES;
}



- (BOOL)application:(UIApplication*)application openURL:(NSURL*)url sourceApplication:(NSString*)sourceApplication annotation:(id)annotation
{
  if (!url) {
    return NO;
  }
  [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:@"RCTPluginHandleOpenURLNotification" object:url]];

  return YES;
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication*)application
{
  [[NSURLCache sharedURLCache] removeAllCachedResponses];
}

+ (NSString*)getRNConfig:(NSString *)key
{
  if (rn_info && key) {
    return [rn_info objectForKey:key];
  }
  return nil;
}

+ (NSString*)getBundleVersion:(NSString *)key
{
  if (bundle_ver && key) {
    return [bundle_ver objectForKey:key];
  }
  return nil;
}

+ (BOOL)isFirstStart{
  
  if ([[NSUserDefaults standardUserDefaults]objectForKey:@"isFirst"]) {
    return NO;
    }
   [[NSUserDefaults standardUserDefaults]setObject:@"true" forKey:@"isFirst"];
    return YES;
}

+ (void)setDeviceToken:(NSString *)dev
{
  device_token = dev;
}

+ (NSString*)getDeviceToken
{
  return device_token;
}

+ (BOOL)isFromCache
{
  return from_cache;
}

+ (NSString*)getCachePath
{
  return build_path;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)devToken
{
  
  [JPUSHService registerDeviceToken:devToken];
  
  NSString* token = [[[[devToken description]
                     stringByReplacingOccurrencesOfString: @"<" withString: @""]
                     stringByReplacingOccurrencesOfString: @">" withString: @""]
                     stringByReplacingOccurrencesOfString: @" " withString: @""];
  
  [AppDelegate setDeviceToken:token];
  

}


// APN注册失败
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //Optional
  NSLog(@"did Fail To Register For Remote Notifications With Error: %@", error);
}


//// 推送服务
/**
 * Remote Notification Received while application was open.
 */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {

  NSLog(@"remote notification: %@",[userInfo description]);
  NSDictionary *apsInfo = [userInfo objectForKey:@"aps"];

  NSString *alert = [apsInfo objectForKey:@"alert"];
  NSLog(@"Received Push Alert: %@", alert);
  UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"您有新消息" message:alert delegate:nil cancelButtonTitle:nil otherButtonTitles:nil, nil];;
  [alertView addButtonWithTitle:@"关闭"];
  [alertView show];

  NSString *sound = [apsInfo objectForKey:@"sound"];
  NSLog(@"Received Push Sound: %@", sound);
  if (sound) {
    AudioServicesPlaySystemSound([sound intValue]);
  }

  NSString *badge = [apsInfo objectForKey:@"badge"];
  NSLog(@"Received Push Badge: %@", badge);
  application.applicationIconBadgeNumber = [[apsInfo objectForKey:@"badge"] integerValue];

   [JPUSHService handleRemoteNotification:userInfo];
}


// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  // Required
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler();  // 系统要求执行这个方法
}


- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  
  [JPUSHService handleRemoteNotification:userInfo];
  completionHandler(UIBackgroundFetchResultNewData);
  
}


- (void)applicationDidEnterBackground:(UIApplication *)application
{
  _bgTask = [application beginBackgroundTaskWithExpirationHandler:^{
    [NSURLProtocol registerClass:[LocalURLProtocol class]];

    NSURL *jsCodeLocation = [self getJsCodeLocation];

    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                 moduleName:@"TTLApp"
                                                 initialProperties:nil
                                                 launchOptions:nil];

    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    MainViewController
    *rootViewController = [MainViewController new];
    rootViewController.view = rootView;

    self.navController = [[CustomNavigationController alloc] init];

    [self.navController pushViewController:rootViewController animated:YES];
    self.window.rootViewController = self.navController;
    [self.window makeKeyAndVisible];

    [[UIApplication sharedApplication] endBackgroundTask: _bgTask];
    _bgTask = UIBackgroundTaskInvalid;

  }];

}


- (void)applicationDidBecomeActive:(UIApplication *)application{
  
     RCTUpdater*updater=[[RCTUpdater alloc]init];
     [updater checkVersionUpdate];
  
}

@end
