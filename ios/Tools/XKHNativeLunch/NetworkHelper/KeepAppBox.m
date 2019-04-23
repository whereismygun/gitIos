//
//  KeepAppBox.m
//  qmjs
//
//  Created by 程龙 on 14-5-7.
//  Copyright (c) 2014年 sea. All rights reserved.
//

#import "KeepAppBox.h"
#import "PublicDefine.h"
#import <CommonCrypto/CommonDigest.h>
#include <sys/sysctl.h>
//#import "WXUtil.h"
#import "NSString+URLEscapes.h"
#define FileHashDefaultChunkSizeForReadingData 1024*8 // 8K qazwsx@jixin!2016
#define Key @"jxsecret@2016"
#define appKey @"10011";

//在Keychain中的标识，这里取bundleIdentifier + UUID / OpenUDID
#define KEYCHAIN_IDENTIFIER(a)  ([NSString stringWithFormat:@"%@_%@",[[NSBundle mainBundle] bundleIdentifier],a])

#define isNull(a) (a==nil ||\
                   a==NULL ||\
                   (NSNull *)(a)==[NSNull null] ||\
                   ((NSString *)a).length==0)
@implementation KeepAppBox

//增加值
+ (void)keepVale:(id)value forKey:(NSString *)key
{
    NSUserDefaults *appBox = [NSUserDefaults standardUserDefaults];
    [appBox setValue:value forKey:key];
    [appBox synchronize];
}

+ (void)saveBoolValue:(BOOL)value withKey:(NSString *)key {
    NSUserDefaults *appBox = [NSUserDefaults standardUserDefaults];
    [appBox setBool:value forKey:key];
    [appBox synchronize];
}
+ (BOOL)boolValueWithKey:(NSString *)key {
    NSUserDefaults *appBox = [NSUserDefaults standardUserDefaults];
    return [appBox boolForKey:key];
}
//减少值
+ (void)deleteValueForkey:(NSString *)key
{
    NSUserDefaults *appBox = [NSUserDefaults standardUserDefaults];
    if ([appBox objectForKey:key])
    {
        [appBox removeObjectForKey:key];
        [appBox synchronize];
    }
}

//根据KEY查找对应的值
+ (id)checkValueForkey:(NSString *)key
{
    NSUserDefaults *appBox = [NSUserDefaults standardUserDefaults];
    if ([appBox objectForKey:key])
    {
        NSString *value = [appBox objectForKey:key];
        return value;
    }else{
        return nil;
    }
}

//爱好只能由中文、字母组成
+ (BOOL)isValidateHobby:(NSString *)nickname
{
    NSString *realnameRegex = @"[a-zA-Z\u4e00-\u9fa5]+";
    NSPredicate *passWordPredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",realnameRegex];
    return [passWordPredicate evaluateWithObject:nickname];
}

//昵称，个性签名只能由中文、字母或数字组成
+ (BOOL)isValidateNick:(NSString *)nickname{
    NSString *realnameRegex = @"[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]+";
    NSPredicate *passWordPredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",realnameRegex];
    return [passWordPredicate evaluateWithObject:nickname];
}

//验证真实姓名
+ (BOOL)isValidateRealname:(NSString *)realname
{
    NSString *realnameRegex = @"^[\u4e00-\u9fa5]{2,3}$";
    NSPredicate *passWordPredicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@",realnameRegex];
    return [passWordPredicate evaluateWithObject:realname];
}

//验证账号是不是纯英文 或者 英文加数字
+ (BOOL)isValidateNickname:(NSString *)Nickname
{
    NSString *nameRegex = @"^(?!\\d+$)[a-zA-Z0-9]{1,}$";
    NSPredicate *nameTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",nameRegex];
    return [nameTest evaluateWithObject:Nickname];
}

//验证邮箱格式
+ (BOOL)isValidateEmail:(NSString *)email
{
    NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",emailRegex];
    return [emailTest evaluateWithObject:email];
}

//验证电话格式
+ (BOOL)isValidatePhone:(NSString *)phone
{
    NSString *phoneRegex = @"^((17[1,3,5,6,7,8])|(14[5,7,9])|(13[0-9])|(15[[0-3],[5-9]])|(18[0,0-9]))\\d{8}$";
    NSPredicate *phoneTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@", phoneRegex];
    return [phoneTest evaluateWithObject:phone];
}

//验证身份证格式
+ (BOOL)isIdNumberValid:(NSString*)idNum
{
    NSString *idNumRegex = @"^(^\\d{15}$|^\\d{18}$|^\\d{17}(\\d|X|x))$";
    NSPredicate *idNumTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@", idNumRegex];
    return [idNumTest evaluateWithObject:idNum];
}

//返回字符字节长度
+ (NSInteger)convertToInt:(NSString *)strtemp
{
    NSInteger strlength = 0;
    char* p = (char*)[strtemp cStringUsingEncoding:NSUnicodeStringEncoding];
    for (NSInteger i=0 ; i<[strtemp lengthOfBytesUsingEncoding:NSUnicodeStringEncoding] ;i++)
    {
        if (*p)
        {
            p++;
            strlength++;
        }
        else
        {
            p++;
        }
    }
    return (strlength +1 )/2;
}


//返回当前传入的下层最近的一个UIViewController
+ (UIViewController *)viewController:(id)view
{
    for (UIView *next = [view superview]; next; next = next.superview)
    {
        UIResponder *nextResponder = [next nextResponder];
        if ([nextResponder isKindOfClass:[UIViewController class]])
        {
            return (UIViewController *)nextResponder;
        }
    }
    return nil;
}


+ (void)setBtnEdge:(UIButton *)btn
{
    btn.layer.cornerRadius = 3;
    btn.layer.borderWidth = 1;
    btn.layer.borderColor = [[UIColor whiteColor]CGColor];
}


//获取view的动态高度
+ (CGFloat)getPriceChooseCellHeight:(NSArray *)infoArr
{
    if (infoArr.count > 0 && infoArr.count <= 4) {
        return 50;
    }
    else
    {
        NSInteger count = infoArr.count *10/40;
        NSInteger AA = (infoArr.count *10 ) - (count *40);
        NSInteger count2 = infoArr.count/4;
        if (AA >= 10) {
            return (count2 + 1) *50;
        }
        else{

            return count2 *50;
        }
    }
}

//设置内容来返回的字段
+ (void)setbuttonContenWith:(NSString *)str withButton:(UIButton *)btn
{
    if (SCREEN_WIDTH > 320)
    {
        if ([KeepAppBox convertToInt:str]== 2) {
            [btn setTitle:str forState:UIControlStateNormal];
        }
        else if ([KeepAppBox convertToInt:str] == 3){
            [btn setTitle:[NSString stringWithFormat:@"%@ ",str] forState:UIControlStateNormal];
        }
        else if ([KeepAppBox convertToInt:str] >= 4){
            NSString*string = nil;
            string = [str substringToIndex:4];
            [btn setTitle:[NSString stringWithFormat:@"%@..   ",string] forState:UIControlStateNormal];
        }
    }
    else
    {
        if ([KeepAppBox convertToInt:str]== 2) {
            [btn setTitle:str forState:UIControlStateNormal];
        }
        else if ([KeepAppBox convertToInt:str] == 3){
            [btn setTitle:[NSString stringWithFormat:@"%@ ",str] forState:UIControlStateNormal];
        }
        else if ([KeepAppBox convertToInt:str] >= 4){
            NSString*string = nil;
            string = [str substringToIndex:3];
            [btn setTitle:[NSString stringWithFormat:@"%@..   ",string] forState:UIControlStateNormal];
        }
        
    }
    
}

+ (void)setHotelbuttonContenWith:(NSString *)str withButton:(UIButton *)btn
{
    if (SCREEN_WIDTH > 320)
    {
        if (str.length ==4){
            [btn setTitle:[NSString stringWithFormat:@"%@  ",str] forState:UIControlStateNormal];
        }
        else if (str.length < 4)
        {
            [btn setTitle:str forState:UIControlStateNormal];
        }
        else{
            NSString*string = nil;
            string = [str substringToIndex:4];
            [btn setTitle:[NSString stringWithFormat:@"%@..",string] forState:UIControlStateNormal];
            
        }
    }
    else
    {
        if (str.length ==4){
            [btn setTitle:[NSString stringWithFormat:@"%@  ",str] forState:UIControlStateNormal];
        }
        else if (str.length < 4)
        {
            [btn setTitle:str forState:UIControlStateNormal];
        }
        else{
            NSString*string = nil;
            string = [str substringToIndex:4];
            [btn setTitle:[NSString stringWithFormat:@"%@..  ",string] forState:UIControlStateNormal];
            
        }
    }


}
+ (void)setHotelPricebuttonContenWith:(NSString *)str withButton:(UIButton *)btn
{
    if (str.length ==6){
        [btn setTitle:[NSString stringWithFormat:@"%@  ",str] forState:UIControlStateNormal];
    }
    else if (str.length < 6)
    {
        [btn setTitle:str forState:UIControlStateNormal];
    }
    else
    {
        NSString*string = nil;
        string = [str substringToIndex:7];
        [btn setTitle:[NSString stringWithFormat:@"%@..",string] forState:UIControlStateNormal];
        
    }
}

+ (NSString *)getSystemTime;
{
    NSDateFormatter *formatter =[[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyyMMddHHmmss"];
    NSString *currentTime = [formatter stringFromDate:[NSDate date]];
    return currentTime;
}

+ ( UIImage  *)imageWithColor:( UIColor  *)color size:( CGSize )size
{
    @autoreleasepool  {
        
        CGRect  rect =  CGRectMake ( 0 ,  0 , size. width , size. height );
        
        UIGraphicsBeginImageContext (rect. size );
        
        CGContextRef  context =  UIGraphicsGetCurrentContext ();
        
        CGContextSetFillColorWithColor (context,
                                        
                                        color. CGColor );
        
        CGContextFillRect (context, rect);
        
        UIImage  *img =  UIGraphicsGetImageFromCurrentImageContext ();
        
        UIGraphicsEndImageContext ();
        
        return  img;
        
    }
}

#pragma mark - 硬件版本
+ (NSString *)platform
{
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    char *machine = malloc(size);
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    NSString *platform = [NSString stringWithCString:machine encoding:NSUTF8StringEncoding];
    free(machine);
    return platform;
}
//版本渠道
+ (NSString *)getChannel{
    return @"App Store";
}

+ (NSString *)getUUID{
        //读取keychain缓存
        NSString *deviceID = [self load:KEYCHAIN_IDENTIFIER(@"UUID")];
        //不存在，生成UUID
        if (isNull(deviceID))
        {
            CFUUIDRef uuid_ref = CFUUIDCreate(kCFAllocatorDefault);
            CFStringRef uuid_string_ref= CFUUIDCreateString(kCFAllocatorDefault, uuid_ref);
            CFRelease(uuid_ref);
            deviceID = [NSString stringWithString:(__bridge NSString*)uuid_string_ref];
            deviceID = [deviceID lowercaseString];
            if (!isNull(deviceID))
            {
                [self save:KEYCHAIN_IDENTIFIER(@"UUID") data:deviceID];
            }
            CFRelease(uuid_string_ref);
        }
        if (isNull(deviceID)) {
            NSLog(@"get deviceID error!");
        }
        return deviceID;

}
#pragma mark - Private Method Keychain相关
+ (NSMutableDictionary *)getKeychainQuery:(NSString *)service
{
    return [NSMutableDictionary dictionaryWithObjectsAndKeys:
            (__bridge id)(kSecClassGenericPassword),kSecClass,
            service, kSecAttrService,
            service, kSecAttrAccount,
            kSecAttrAccessibleAfterFirstUnlock,kSecAttrAccessible,nil];//第一次解锁后可访问，备份
}

+ (void)save:(NSString *)service data:(id)data
{
    NSMutableDictionary *keychainQuery = [self getKeychainQuery:service];
    SecItemDelete((__bridge CFDictionaryRef)(keychainQuery));
    [keychainQuery setObject:[NSKeyedArchiver archivedDataWithRootObject:data]
                      forKey:(__bridge id<NSCopying>)(kSecValueData)];
    SecItemAdd((__bridge CFDictionaryRef)(keychainQuery), NULL);
}

+ (id)load:(NSString *)service
{
    id ret = nil;
    NSMutableDictionary *keychainQuery = [self getKeychainQuery:service];
    [keychainQuery setObject:(id)kCFBooleanTrue forKey:(__bridge id<NSCopying>)(kSecReturnData)];
    [keychainQuery setObject:(__bridge id)(kSecMatchLimitOne) forKey:(__bridge id<NSCopying>)(kSecMatchLimit)];

    CFTypeRef result = NULL;
    if (SecItemCopyMatching((__bridge_retained CFDictionaryRef)keychainQuery, &result) == noErr)
    {
        ret = [NSKeyedUnarchiver unarchiveObjectWithData:(__bridge NSData*)result];
    }
    return ret;
}


+(NSString*)getAppKey{
    return appKey;
}
+(NSString*)getSystemVersion{
    return [[UIDevice currentDevice] systemVersion];
};
//获取当前时间 用于明细账单日期传值
+(NSString*)getCurrentTimeUsedBill{
        NSDateFormatter *formatter =[[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"yyyy年MM月"];
        NSString *currentTime = [formatter stringFromDate:[NSDate date]];
        NSString *strBtn = [currentTime stringByReplacingOccurrencesOfString:@"年" withString:@"-"];
        NSString * timeBtn = [strBtn substringToIndex:([strBtn length]-1)];
        NSString *timeButton = [timeBtn stringByReplacingOccurrencesOfString:@"-" withString:@""];
    
    return timeButton;
}
//根据字符串是否为空返回字段
+ (NSString *)setUpString:(NSString *)str
{
    if ([str isKindOfClass:[NSNull class]]) {
        
        return @"无";
    }
    else if (str == nil)
    {
    
        return @"无";
    }
    else if ([str integerValue] <= 0)
    {
    
        return @"无";
    }
    else{
    
        return str;
    }
}
+(NSString *)getyyyymmdd{
    NSDate *now = [NSDate date];
    NSDateFormatter *formatDay = [[NSDateFormatter alloc] init];
    formatDay.dateFormat = @"yyyy";
    NSString *dayStr = [formatDay stringFromDate:now];
    return dayStr;
}

//根据字符串是否为空返回字段
+ (NSString *)setUpShare:(NSString *)str
{
    if (str == nil || [str isEqual:[NSNull null]]) {
        return @"";
    }
    else{
        
        return str;
    }
}
+(NSString *)arabicNumeralsToChinese:(int)number{
    
    switch (number) {
            
        case 0:
            
            return @"零";
            
            break;
            
        case 1:
            
            return @"一";
            
            break;
            
        case 2:
            
            return @"二";
            
            break;
            
        case 3:
            
            return @"三";
            
            break;
            
        case 4:
            
            return @"四";
            
            break;
            
        case 5:
            
            return @"五";
            
            break;
            
        case 6:
            
            return @"六";
            
            break;
            
        case 7:
            
            return @"七";
            
            break;
            
        case 8:
            
            return @"八";
            
            break;
            
        case 9:
            
            return @"九";
            
            break;
            
        case 10:
            
            return @"十";
            
            break;
            
        case 100:
            
            return @"百";
            
            break;
            
        case 1000:
            
            return @"千";
            
            break;
            
        case 10000:
            
            return @"万";
            
            break;
            
        case 100000000:
            
            return @"亿";
            
            break;
            
        default:
            
            return nil;
            
            break;
    }
}

//创建签名
+(NSString*)createMd5Sign:(NSMutableDictionary*)dict{
    NSMutableString *contentString  =[NSMutableString string];
    NSArray *keys = [dict allKeys];
    //按字母顺序排序
    NSArray *sortedArray = [keys sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
        return [obj1 compare:obj2 options:NSNumericSearch];
    }];
    //拼接字符串
    for (NSString *categoryId in sortedArray) {
        if ( ![categoryId isEqualToString:@"sign"]
            && ![categoryId isEqualToString:@"Key"]
            ){
            [contentString appendFormat:@"%@%@", categoryId, [dict objectForKey:categoryId]];
        }
    }
     [contentString insertString:Key atIndex:0];
    [contentString appendFormat:@"%@", Key];
    /*有一些特殊符号 和java 加密出的签名不一样 需要特殊处理 ，还有 + 号被转成%20 需要转回来*/
    NSString *transString = [contentString escapedURLString];
    NSMutableString *outputStr = [NSMutableString stringWithString:transString];
    [outputStr replaceOccurrencesOfString:@"%20"
                               withString:@"+"
                                  options:NSLiteralSearch
                                    range:NSMakeRange(0, [outputStr length])];
    [outputStr stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    //得到MD5 sign签名
//    NSString *md5Sign =[WXUtil md5:outputStr];
    //输出Debug Info
//    return md5Sign;
    return nil;
}

+ (NSMutableDictionary *)getHeaderParameter{
    NSMutableDictionary *headerDic = [[NSMutableDictionary alloc] initWithCapacity:8];
    [headerDic setValue: [KeepAppBox getUUID] forKey:@"deviceId"];
//    [headerDic setValue:@([NFUserEntity shareInstance].userId.intValue) forKey:@"userId"];
//    [headerDic setValue:[NFUserEntity shareInstance].token forKey:@"token"];
    [headerDic setValue: @30002 forKey:@"appKey"];
    [headerDic setValue: @"iOS" forKey:@"osType"];
    [headerDic setValue: @10056 forKey:@"appVersion"];
    [headerDic setValue: @"1.5.6" forKey:@"appVer"];
    [headerDic setValue: [KeepAppBox getSystemVersion] forKey:@"version"];
    [headerDic setValue: [KeepAppBox getSystemTime] forKey:@"timestamp"];
    [headerDic setValue: @10001 forKey:@"channelId"];
    return headerDic;
}

/**
 * 输入金额不能超过剩余金额
 * inputMoney 输入的金额
 * remainingMoney 剩余可提现的金额
 */
+(BOOL)isValidateMoneyWithInputMoney:(NSString *)inputMoney toRemainingMoney:(NSString *)remainingMoney {
    
    if (([remainingMoney intValue] - [inputMoney intValue]) >= 0) {
        return YES;
    }
    
    return NO;
}


/**
 * 字符串替换0  如 90---> 9    95---> 9.5
 *
 */
+(NSString *)numStrwithReplacezero:(NSString *)numStr {
    
    NSString *resultStr = @"";
    if (numStr.length >0) {
        
        //先判断有几位数字，只处理2位的数字
        if (numStr.length == 2) {
            
            //截取个位字符 字符串下标从第n 位开始截取,直到最后 （substringFromIndex:n）（包括第 n 位）
            NSString *tempStr1 = [numStr substringFromIndex:1];
            if ([tempStr1 isEqualToString:@"0"]) {
                
                //截取个位字符 字符串截取到第n位  （substringToIndex: n）(第n 位不算再内)
                resultStr = [numStr substringToIndex:1];
            }
            else {
                resultStr = [NSString stringWithFormat:@"%.1f",[numStr floatValue]/10];
            }
        }
        else {
            NSLog(@"---字符串不是两位数字----");
            resultStr = @"";
        }
        
    }
    else {
        NSLog(@"---字符串为空，或者长度为0----");
        resultStr = @"";
    }
    
    return  [NSString stringWithFormat:@"%@折",resultStr];
}


//验证密码格式必须包含数字加字母，不能为特殊符号或者纯数字，字母
+ (BOOL)isValidatePassword:(NSString *)password {
    
    NSString *pwdRegex = @"^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:password];
}

//验证字符串格式是否纯数字
+ (BOOL)isValidateStringPureDigital:(NSString *)str {
    
    NSString *pwdRegex = @"^[0-9]*$";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:str];
}

//验证字符串格式是否纯字母
+ (BOOL)isValidateStringPureLetter:(NSString *)str {
    
    NSString *pwdRegex = @"^[A-Za-z]+$";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:str];
}

//验证字符串格式是否包含特殊字符
+ (BOOL)isValidateSpecialCharacters:(NSString *)str {
    
    NSString *pwdRegex = @"[^%&',;=?$\x22]+";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:str];
}

//验证字符串格式是否有中文
+ (BOOL)isValidateContainsChinese:(NSString *)str {
    
    NSString *pwdRegex = @"[\u4e00-\u9fa5]";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:str];
}

//验证字符串格式是否只包含0--9数字和点
+ (BOOL)isValidateStringContainsOnlyNumbersAndPoints:(NSString *)str {

    NSString *pwdRegex = @"^[0-9]+\.{0,1}[0-9]{0,2}$";
    NSPredicate *pwdTest = [NSPredicate predicateWithFormat:@"SELF MATCHES%@",pwdRegex];
    return [pwdTest evaluateWithObject:str];
}

@end
