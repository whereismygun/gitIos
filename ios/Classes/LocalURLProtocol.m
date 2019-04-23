//
//  LocalURLProtocol.m
//  LlqStudentHD
//
//  Created by PeterPan on 16/5/31.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "LocalURLProtocol.h"
#import "NSData+AES128.h"

#import <AssetsLibrary/ALAsset.h>
#import <AssetsLibrary/ALAssetRepresentation.h>
#import <AssetsLibrary/ALAssetsLibrary.h>
#import <MobileCoreServices/MobileCoreServices.h>

@implementation LocalURLProtocol


static NSString* const hasInitKey = @"LocalURLProtocolKey";


+(BOOL)canInitWithRequest:(NSURLRequest *)request {
  if (![NSURLProtocol propertyForKey:hasInitKey inRequest:request]) {
    // 检查本地是否有缓存文件
    NSString *localURI = [LocalURLProtocol getLocalURIByURL:request];
    NSLog(@"localURI:%@",localURI);
    localURI = [LocalURLProtocol pathForResource:localURI];
    NSLog(@"pathForResource:%@",localURI);
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if(localURI != nil && [fileManager fileExistsAtPath:localURI]){
      NSLog(@"本地存在文件:%@",localURI);
      return YES;
    }
    
    NSLog(@"本地不存在文件:%@",localURI);
  }
  
  return NO;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
  return request;
}

+ (NSString *)getLocalURIByURL:(NSURLRequest *)request {
  NSString *baseURL = @"";
  if ([[request URL] port] == nil) {
    baseURL = [NSString stringWithFormat:@"%@://%@/",[[request URL] scheme],[[request URL] host]];
  }else{
    baseURL = [NSString stringWithFormat:@"%@://%@:%@/",[[request URL] scheme],[[request URL] host],[[request URL] port]];
  }
  if (!([[[request URL] scheme] isEqualToString:@"http"] || [[[request URL] scheme] isEqualToString:@"https"])) {
    return [[request URL] absoluteString];
  }
  NSString *localURI = [[[request URL] absoluteString] stringByReplacingOccurrencesOfString:baseURL withString:@""];
  
  NSRange range = [localURI rangeOfString:@"?"];
  if (range.length > 0 ) {
    localURI = [localURI substringToIndex:range.location];
  }
  
  NSRange rangeMao = [localURI rangeOfString:@"#"];
  if (rangeMao.length > 0 ) {
    localURI = [localURI substringToIndex:rangeMao.location];
  }
  return localURI;
}

+ (NSString*)pathForResource:(NSString*)resourcepath {
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  NSArray *pathCaches = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString *cachePath = [pathCaches objectAtIndex:0];
  
  
  // Cache目录结构：
  // -- save
  // -- update
  //    -- h5
  //    -- rn
  //    -- index.bundlejs
  
  
  // 对于RN模块的本地文件访问逻辑:
  //
  // 1.从缓存中获得图片资源文件
  if ([LocalURLProtocol checkBuildDir:@"save"]) {
    NSString* basePath = [cachePath stringByAppendingString:@"/save"];
    NSString* localUri = [LocalURLProtocol getCachePath:basePath withPartsJoined:nil withFileName:resourcepath];
    if ([fileManager fileExistsAtPath:localUri]) {
      return localUri;
    }
  }
  
  // 2.如果存在更新目录，使用更新目录内容
  if ([LocalURLProtocol checkBuildDir:@"update"]) {
    NSString* basePath = [cachePath stringByAppendingString:@"/update"];
    NSString* localUri;
    if ([resourcepath hasPrefix:@"rn/"]) {
      localUri = [LocalURLProtocol getCachePath:basePath withPartsJoined:nil withFileName:resourcepath];
    } else {
      localUri = [LocalURLProtocol getCachePath:basePath withPartsJoined:@"h5" withFileName:resourcepath];
    }
    
    if([fileManager fileExistsAtPath:localUri]){
      return localUri;
    }
  }
  
  // 3.从APP本地文件中获得
  NSBundle* mainBundle = [NSBundle mainBundle];
  NSMutableArray* directoryParts = [NSMutableArray arrayWithArray:[resourcepath componentsSeparatedByString:@"/"]];
  NSString* filename = [directoryParts lastObject];
  [directoryParts removeLastObject];
  NSString* directoryPartsJoined = [directoryParts componentsJoinedByString:@"/"];
  
  NSString* dirStr = @"Staging";
  if ([resourcepath hasPrefix:@"rn/"]) {
    dirStr = [NSString stringWithFormat:@"%@/%@/", @"Staging", directoryPartsJoined];
  } else {
    if ([directoryPartsJoined length] > 0) {
      dirStr = [NSString stringWithFormat:@"%@/%@/%@/", @"Staging", @"h5", directoryPartsJoined];
    } else {
      dirStr = [NSString stringWithFormat:@"%@/%@/", @"Staging", @"h5"];
    }
  }
  
  NSString* localUri = [mainBundle pathForResource:filename ofType:@"" inDirectory:dirStr];
  if([fileManager fileExistsAtPath:localUri]){
    return localUri;
  }
  
  return nil;
}

+ (BOOL)checkBuildDir:(NSString*)path {
  if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
    return YES;
  }
  return NO;
}

+ (NSString*)getCachePath:(NSString*)basePath withPartsJoined:(NSString*)subDir withFileName:(NSString*)fileName {
  NSString* directoryStr;
  if (subDir != nil && [subDir length] > 0) {
    directoryStr = [NSString stringWithFormat:@"%@/%@/%@", basePath, subDir, fileName];
  } else {
    directoryStr = [NSString stringWithFormat:@"%@/%@", basePath, fileName];
  }
  return directoryStr;
}

Boolean needDecrypted = false;

-(void)startLoading{
  NSLog(@"%@", [[self.request URL] absoluteString]);
  NSString *localURI = [LocalURLProtocol getLocalURIByURL:[self request]];
  localURI = [LocalURLProtocol pathForResource:localURI];
  NSString* mimeType = [self getMimeType:localURI];
  NSURLResponse *response = [[NSURLResponse alloc] initWithURL:[self.request URL]
                                                      MIMEType:mimeType
                                         expectedContentLength:-1
                                              textEncodingName:nil];
  NSData *data = [NSData dataWithContentsOfFile:localURI];
  [[self client] URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageAllowed];
  
  if(needDecrypted){
    NSData *decryptedData =[data AES128Decrypt];
    [[self client] URLProtocol:self didLoadData:decryptedData];
  }else{
    [[self client] URLProtocol:self didLoadData:data];
  }
  [[self client] URLProtocolDidFinishLoading:self];
}

- (void)stopLoading{
  NSLog(@"stoploading!");
}

-(NSString *)getMimeType:(NSString *)localURI{
  
  NSString *extension = [localURI pathExtension];
  
  CFStringRef typeId = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, (__bridge CFStringRef)extension, NULL);
  NSString* mimeType = @"*/*";
  if (typeId) {
    mimeType = (__bridge_transfer NSString*)UTTypeCopyPreferredTagWithClass(typeId, kUTTagClassMIMEType);
    if (!mimeType) {
      // special case for m4a
      if ([(__bridge NSString*)typeId rangeOfString : @"m4a-audio"].location != NSNotFound) {
        mimeType = @"audio/mp4";
      } else if ([[localURI pathExtension] rangeOfString:@"wav"].location != NSNotFound) {
        mimeType = @"audio/wav";
      }
    }
    CFRelease(typeId);
  }
  if ([[extension lowercaseString] isEqualToString:@"w"]){
    mimeType = @"text/html";
  }
  NSLog(@"extension:%@",extension);
  return mimeType;
}


@end
