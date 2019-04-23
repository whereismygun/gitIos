//
//  AppUpdater.h
//  LlqStudentHD
//
//  Created by PeterPan on 2016/12/2.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AppUpdater : NSObject

#define URL_LATEST @"https://down-cdn.007fenqi.com/app/rn/%@/latest.json"
#define URL_BUNDLE @"https://down-cdn.007fenqi.com/app/rn/%@/bundle/%@"

#define URL_FILE_BUNDLE @"https://down-cdn.007fenqi.com/app/rn/%@/bundle/%@/ios/"
#define URL_FILE_PATCH @"https://down-cdn.007fenqi.com/app/rn/%@/patch/%@/ios/"

@property (nonatomic, retain) NSDictionary *latest;
@property (nonatomic, retain) NSArray *bundle;
@property (nonatomic, retain) NSString *cachePath;
@property (nonatomic, retain) NSString *buildPath;
@property (nonatomic, retain) NSString *tmpPath;
@property (nonatomic, retain) NSFileManager *fm;



- (void)checkAndUpdate:(NSDictionary*)appInfo;

@end
