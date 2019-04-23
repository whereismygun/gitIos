//
//  MainViewController.m
//  LlqStudentHD
//
//  Created by PeterPan on 16/8/11.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
  self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
  if (self) {
    // Uncomment to override the CDVCommandDelegateImpl used
    // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
    // Uncomment to override the CDVCommandQueue used
    // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
  }
  return self;
}

- (id)init
{
  self = [super init];
  if (self) {
    // Uncomment to override the CDVCommandDelegateImpl used
    // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
    // Uncomment to override the CDVCommandQueue used
    // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
  }
  return self;
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
  // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
  // you can do so here.
  
  [super viewWillAppear:animated];
  [self hiddenNaviBar];
  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
}

- (void)hiddenNaviBar
{
  [self.navigationController setNavigationBarHidden:YES];
  [self.navigationController setToolbarHidden:YES];
}


@end
