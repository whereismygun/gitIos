


#import "PublicDefine.h"

#ifdef DEBUG
#   define DLog(format, ...) NSLog((@"%s [Line %d]:\n %s = " format), __PRETTY_FUNCTION__, __LINE__, #__VA_ARGS__, ##__VA_ARGS__);
#else
#   define DLog(...)
#endif
//回传下载图片结果
typedef void (^ResultDown)(BOOL success, UIImage *image);

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)
#define SCREEN_HEIGHT ([UIScreen mainScreen].bounds.size.height)
#define WYWeakSelfDefine __weak __typeof(&*self) weakSelf = self

#define kUserDefaults   [NSUserDefaults standardUserDefaults]


#define dx ([UIScreen mainScreen].bounds.size.width/1242.0)
#define dy ([UIScreen mainScreen].bounds.size.height/2208.0)
#define is4inch (([UIScreen mainScreen].bounds.size.height < 667.0)?(YES):(NO))

#define xxlfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(17.0):(19.0))

#define xfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(14.0):(16.0))
#define xmlfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(15.0):(17.0))
#define xlfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(16.0):(18.0))

#define mfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(13.0):(15.0))
#define mmfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(12.0):(14.0))
#define mlfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(11.0):(13.0))
#define msfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(10.0):(12.0))
#define sfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(11.0):(12.0))
#define ssfontsize (([UIScreen mainScreen].bounds.size.height < 667.0)?(9.0):(10.0))


//根据屏幕宽度适配iphone6高度,参数a是在iphone6P(即736高度)情况下的高
#define GetAdaptationHeightByScreenHeight(a) ceilf(a * (ScreenHeight/2208))

// 根据屏幕宽度适配iphone6宽度,参数a是在iphone6P(即414宽度)情况下的宽
#define GetAdaptationWightByScreenWith(a) ceilf(a * (ScreenWidth/1242))

//根据屏幕宽度适配iphone5s高度,参数a是在iphone6P(即736高度)情况下的高
#define GetAdaptationHeightByScreenHeight5s(a) ceilf(a * (ScreenHeight/1136))

// 根据屏幕宽度适配iphone5s宽度,参数a是在iphone6P(即414宽度)情况下的宽
#define GetAdaptationWightByScreenWidth5s(a) ceilf(a * (ScreenWidth/640))

#define GetAdaptationWightByScreenWith5s(a) ceilf(a * (ScreenWidth/640))
//根据屏幕1080 *1920 按比例适配 参数a 是 1080 * 1920 情况下的宽
#define GetAdaptationWightByScreenWith6(a) ceilf(a * (ScreenWidth/1080))

//根据屏幕1080 *1920 按比例适配 参数a 是 1080 * 1920 情况下的宽
#define GetAdaptationHeightByScreenHeight6(a) ceilf(a * (ScreenHeight/1920))


//相对iphone6 屏幕比
#define KWidth_Scale    [UIScreen mainScreen].bounds.size.width/375.0f


/**
 *  获取appdelegate
 */
#define SharedApp ((AppDelegate *)[[UIApplication sharedApplication] delegate])
/**
 *  获取屏幕大小
 */
#define WindowFrame [UIApplication sharedApplication].keyWindow.frame


//首页默认图
//#define kAppPlaceholderImage [UIImage imageNamed:@"Public-rectangle2"]
//头像
#define HeadImagePlaceholderImage [UIImage imageNamed:@"ic_hand_portrait_"]

//判断是否是6P
#define IsIphone6Plus  [[KeepAppBox platformString] isEqualToString:@"iPhone6_Plus"]
//判断是否是6或者6P
#define IsIphone6Or6P  ([[KeepAppBox platformString] isEqualToString:@"iPhone6"] || [[KeepAppBox platformString] isEqualToString:@"iPhone6_Plus"])
//判断是否是5s
#define IsIphone5S  [[KeepAppBox platformString] isEqualToString:@"iPhone5S"]
//判断是否是5
#define IsIphone5  [[KeepAppBox platformString] isEqualToString:@"iPhone5"]
//判断是否是4S
#define IsIphone4S  [[KeepAppBox platformString] isEqualToString:@"iPhone4S"]

// View 圆角
#define ViewRadius(View, Radius)\
\
[View.layer setCornerRadius:(Radius)];\
[View.layer setMasksToBounds:YES]

//Use HEX color value with 0x000000 format
#define QQColorAlpha(r, g, b, a) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:a]
#define QQColor(r, g, b) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:1.0]
#define RGBColor(rgbValue, alphaValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:alphaValue]
#define ZXRandomColor  QNColor(arc4random_uniform(256), arc4random_uniform(256), arc4random_uniform(256))

#define RGBAColor(r, g, b ,a) [UIColor colorWithRed:(r)/255.0 green:(g)/255.0 blue:(b)/255.0 alpha:a] 
#define RandColor RGBColor(arc4random_un]
#define UIColorFromRGB(rgbValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.f]


//通用cell,透明灰色描边
#define NFClearGrayColor   [UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1]

//我的主页背景色调
#define NFMineHomeGrayColor      [UIColor colorWithRed:241/255.0 green:241/255.0 blue:241/255.0 alpha:1]

//APP 字体颜色
#define NFSendLigtColor   [UIColor colorWithRed:59/255.0 green:59/255.0 blue:59/255.0 alpha:1]

//导航栏颜色
#define NFNavBackColor   [UIColor colorWithRed:0.090 green:0.541 blue:1.000 alpha:1.000]

//按钮颜色
#define NFButtonColor   [UIColor colorWithRed:234/255 green:20/255 blue:20/255 alpha:1.0f]
//页面背景颜色
#define ViewBackgroundColor   [UIColor colorWithWhite:0.922 alpha:1.000]


#define kWoManBackColor     [UIColor colorWithRed:230/255.0 green:105/255.0 blue:105/255.0 alpha:1.0]

//圆角边框颜色
#define kViewBorderRadiusBackColor       [UIColor colorWithRed:0.8119 green:0.8119 blue:0.8119 alpha:1.0]
// View 圆角和加边框
#define ViewBorderRadius(View, Radius, Width, Color)\
\
[View.layer setCornerRadius:(Radius)];\
[View.layer setMasksToBounds:YES];\
[View.layer setBorderWidth:(Width)];\
[View.layer setBorderColor:[Color CGColor]]

#define kCircleImageRadiu           12

#define kRequestTimeout             30
#define kAlertShowTime              1.5

/**
 *  NOTI NAME AND USE
 */
//分享界面
#define kShare_Succeed                   @"Share_Succeed"
//跳转信息完善界面
#define kGoto_Login_Rootview_infomation         @"kGoto_Login_Rootview_infomation"
//跳转到APP首页
#define kGoto_Login_Rootview_SportHome          @"kGoto_Login_Rootview_SportHome"
//不跳转直接到登陆首页
#define kGoto_Login_Rootview_LgoinHome          @"kGoto_Login_Rootview_LgoinHome"

/**
 *  数据库在缓存文件里面的名字
 */
#define kFMDBFilename       @"SearchHistory.db"
#define mUserDefaults       [NSUserDefaults standardUserDefaults]

///七牛
#define QiniuAccessKey   @"U7nMCeH1ldx-O9zwO2iT2nWiLBDBFRXWiNfOpRW-"
#define QiniuSecretKey   @"RR87Nb9hYYiA3NoI3GpMNiZP6WqeqLVv3TtnJYcy"
#define QiniuBucketName  @""

//#define QiniuBaseURL     @"obd8i1g1f.bkt.clouddn.com"//测试

#define QiniuBaseURL     @"obd8e516k.bkt.clouddn.com"//正式

