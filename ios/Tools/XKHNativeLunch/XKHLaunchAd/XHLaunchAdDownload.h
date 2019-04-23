//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef void(^XHLaunchAdDownloadProgressBlock)(unsigned long long total, unsigned long long current);

@protocol XHLaunchAdDownloadDelegate <NSObject>

- (void)downloadFinishWithURL:(nonnull NSURL *)url;

@end

@interface XHLaunchAdDownload : NSObject

@property (assign, nonatomic ,nonnull)id<XHLaunchAdDownloadDelegate> delegate;

@end

#pragma mark - XHLaunchAdImageDownload

typedef void(^XHLaunchAdDownloadImageCompletedBlock)(UIImage *_Nullable image, NSData * _Nullable data, NSError * _Nullable error);


@interface XHLaunchAdImageDownload : XHLaunchAdDownload

-(nonnull instancetype)initWithURL:(nonnull NSURL *)url delegateQueue:(nonnull NSOperationQueue *)queue progress:(nullable XHLaunchAdDownloadProgressBlock)progressBlock completed:(nullable XHLaunchAdDownloadImageCompletedBlock)completedBlock;

@end

#pragma mark - XHLaunchAdVideoDownload
typedef void(^XHLaunchAdDownloadVideoCompletedBlock)(NSURL * _Nullable location, NSError * _Nullable error);

@interface XHLaunchAdVideoDownload : XHLaunchAdDownload

-(nonnull instancetype)initWithURL:(nonnull NSURL *)url delegateQueue:(nonnull NSOperationQueue *)queue progress:(nullable XHLaunchAdDownloadProgressBlock)progressBlock completed:(nullable XHLaunchAdDownloadVideoCompletedBlock)completedBlock;

@end
