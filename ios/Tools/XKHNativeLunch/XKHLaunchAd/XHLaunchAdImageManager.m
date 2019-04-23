//
//  xkh
//
//  Created by apple on 2017/4/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "XHLaunchAdImageManager.h"
#import "XHLaunchAdCache.h"

@interface XHLaunchAdImageManager()

@property(nonatomic,strong) XHLaunchAdDownloader *downloader;
@end

@implementation XHLaunchAdImageManager

+(nonnull instancetype )sharedManager{
    
    static XHLaunchAdImageManager *instance = nil;
    static dispatch_once_t oneToken;
    dispatch_once(&oneToken,^{
        
        instance = [[XHLaunchAdImageManager alloc] init];
        
    });
    return instance;
}
- (instancetype)init
{
    self = [super init];
    if (self) {
        
        _downloader = [XHLaunchAdDownloader sharedDownloader];
    }
    return self;
}
- (void)loadImageWithURL:(nullable NSURL *)url options:(XHLaunchAdImageOptions)options progress:(nullable XHLaunchAdDownloadProgressBlock)progressBlock completed:(nullable XHExternalCompletionBlock)completedBlock
{
    if(!options) options = XHLaunchAdImageDefault;
    if(options & XHLaunchAdImageOnlyLoad)
    {
        
        [_downloader downloadImageWithURL:url progress:progressBlock completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error) {
           
            if(completedBlock) completedBlock(image,error,url);
            
        }];
    }
    else if (options & XHLaunchAdImageRefreshCached)
    {
        
        UIImage *image = [XHLaunchAdCache getCacheImageWithURL:url];
        if(image && completedBlock) completedBlock(image,nil,url);
        [_downloader downloadImageWithURL:url progress:progressBlock completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error) {
            
            if(completedBlock) completedBlock(image,error,url);
            [XHLaunchAdCache async_saveImageData:data imageURL:url];
            
        }];
        
    }
    else if (options & XHLaunchAdImageCacheInBackground)
    {
        UIImage *image = [XHLaunchAdCache getCacheImageWithURL:url];
        if(image && completedBlock)
        {
            completedBlock(image,nil,url);
        }
        else
        {
            [_downloader downloadImageWithURL:url progress:progressBlock completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error) {
                
                [XHLaunchAdCache async_saveImageData:data imageURL:url];
                
            }];
        }
        
    }
    else//default
    {
        UIImage *image = [XHLaunchAdCache getCacheImageWithURL:url];
        if(image && completedBlock)
        {
            completedBlock(image,nil,url);
        }
        else
        {
            [_downloader downloadImageWithURL:url progress:progressBlock completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error) {
                
                if(completedBlock) completedBlock(image,error,url);
                
                [XHLaunchAdCache async_saveImageData:data imageURL:url];
                
            }];
        }
        
    }
}
@end
