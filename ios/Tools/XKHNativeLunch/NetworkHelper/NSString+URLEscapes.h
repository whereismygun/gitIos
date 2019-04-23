//
//  NSString+URLEscapes.h
//  
//
//  Created by TonyChan on 15/12/18.
//  Copyright © 2015年 BlockStudio. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface NSString (URLEscapes)
- (NSString *)escapedURLString;
- (NSString *)originalURLString;

@end
