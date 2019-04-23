//
//  AppUtils.m
//  LlqStudentHD
//
//  Created by PeterPan on 2016/12/5.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppUtils.h"

@implementation AppUtils

+ (int)compareVersion:(NSString*)v1 otherVersion:(NSString*)v2
{
  NSArray *arr1 = [v1 componentsSeparatedByString:@"."];
  NSArray *arr2 = [v2 componentsSeparatedByString:@"."];
  
  int arr1Int, arr2Int;
  
  for (int i=0; i<arr1.count; i++) {
    arr1Int = [arr1[i] intValue];
    arr2Int = [arr2[i] intValue];
    if (arr1Int < arr2Int) {
      return -1;
    } else if (arr1Int > arr2Int) {
      return 1;
    }
  }
  
  return 0;
}

@end
