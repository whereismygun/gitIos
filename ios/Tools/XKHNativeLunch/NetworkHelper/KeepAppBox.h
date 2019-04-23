//
//  KeepAppBox.h
//  qmjs
//  Created by 程龙 on 14-5-7.
//  Copyright (c) 2014年 sea. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface KeepAppBox : NSObject

//+(NSString *)getDebugifo;
//增加值存储
+ (void)keepVale:(id)value forKey:(NSString *)key;

+ (void)saveBoolValue:(BOOL)value withKey:(NSString *)key;
+ (BOOL)boolValueWithKey:(NSString *)key;
//减少值
+ (void)deleteValueForkey:(NSString *)key;

//根据KEY查找对应的值-不存在返回nil
+ (id)checkValueForkey:(NSString *)key;

//爱好只能由中文、字母组成
+ (BOOL)isValidateHobby:(NSString *)nickname;

//昵称只能由中文、字母或数字组成
+ (BOOL)isValidateNick:(NSString *)nickname;

//验证真实姓名
+ (BOOL)isValidateRealname:(NSString *)realname;

//验证账号是不是纯英文 或者 英文加数字
+ (BOOL)isValidateNickname:(NSString *)email;

//验证邮箱格式
+ (BOOL)isValidateEmail:(NSString *)email;

//验证电话格式
+ (BOOL)isValidatePhone:(NSString *)phone;

//验证身份证格式
+ (BOOL)isIdNumberValid:(NSString *)idNum;

#pragma maek -- cocoaReactive
//+ (BOOL)validateTelephoneSignal:(NSString *)phone;
//返回字符字节长度
+ (NSInteger)convertToInt:(NSString *)strtemp;

//返回当前传入的下层最近的一个UIViewController
+ (UIViewController *)viewController:(id)view;

//设置按钮圆角白框
+ (void)setBtnEdge:(UIButton *)btn;

//获取view的动态高度
+ (CGFloat)getPriceChooseCellHeight:(NSArray *)infoArr;

//设置内容来返回的字段 婚车租赁用
+ (void)setbuttonContenWith:(NSString *)str withButton:(UIButton *)btn;

//设置酒店tit文字长度
+ (void)setHotelPricebuttonContenWith:(NSString *)str withButton:(UIButton *)btn;

//设置酒店tit文字长度
+ (void)setHotelbuttonContenWith:(NSString *)str withButton:(UIButton *)btn;

//获取当前的系统时间
+ (NSString *)getSystemTime;

//根据色值返回图片
+ (UIImage  *)imageWithColor:( UIColor  *)color size:( CGSize )size;

//判断当前的机型
+ (NSString *)platformString;

//随机获取唯一id
+ (NSString *)getUUID;
//回去系统版本号
+(NSString*)getSystemVersion;
//版本渠道
+ (NSString *)getChannel;
+(NSString*)getAppKey;

//获取当前时间 用于明细账单日期传值
+(NSString*)getCurrentTimeUsedBill;
+(NSString *)getyyyymmdd;


//根据字符串是否为空返回字段
+ (NSString *)setUpString:(NSString *)str;
+(NSString *)arabicNumeralsToChinese:(int)number;
//设置字符串为null
+ (NSString *)setUpShare:(NSString *)str;

//创建签名
+(NSString*) createMd5Sign:(NSMutableDictionary*)dict;
+ (NSMutableDictionary *)getHeaderParameter;

/**
 * 输入金额不能超过剩余金额
 */
+(BOOL)isValidateMoneyWithInputMoney:(NSString *)inputMoney toRemainingMoney:(NSString *)remainingMoney;

/**
 * 字符串替换0  如 90---> 9    95---> 9.5
 *
 */
+(NSString *)numStrwithReplacezero:(NSString *)numStr;

//验证密码格式必须包含数字加字母，不能为特殊符号或者纯数字，字母
+ (BOOL)isValidatePassword:(NSString *)password;

//验证字符串格式是否纯数字
+ (BOOL)isValidateStringPureDigital:(NSString *)str;

//验证字符串格式是否纯字母
+ (BOOL)isValidateStringPureLetter:(NSString *)str;

//验证字符串格式是否包含特殊字符
+ (BOOL)isValidateSpecialCharacters:(NSString *)str;

//验证字符串格式是否有中文
+ (BOOL)isValidateContainsChinese:(NSString *)str;

//验证字符串格式是否只包含0--9数字和点
+ (BOOL)isValidateStringContainsOnlyNumbersAndPoints:(NSString *)str;


@end
