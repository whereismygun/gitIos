/**
 *
 *
 * @flow
 *
 */
'use strict';

import React,{Component} from 'react';
import {
    StyleSheet,
    Navigator,
    TouchableOpacity,
    View,
    InteractionManager,
    Text,
    ListView,
} from 'react-native';

import {connect} from 'react-redux';

const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyListContainer = require('FlyListContainer');
const FlyImage = require('FlyImage');
const FlyBase = require('FlyBase');
const FlyButton = require('FlyButton');
const FlyHeader = require('FlyHeader');
const SceneUtils = require('SceneUtils');
const FlyItem = require('FlyItem');

type Props = {
    navigator: Navigator;
    title:string;
};

const source ={

    '注册及认证问题':[
      {
        title:'一、 如何注册？',
        des:'中华人民共和国公民年满18周岁，具备完全民事权利能力和民事行为能力，可以提交注册、认证申请并通过通通理财的审核，成为通通理财用户。\r\n1、进入APP后，点击底栏【我的资产】即可点击进入登录/注册页面，输入手机号；\r\n2、点击获取并输入短信验证码（若未收到，请查询是否被手机安全软件拦截）；\r\n3、设置密码并重复输入密码（两次输入的密码必须一致）；\r\n4、点击【注册】，即可注册成功。',
      },
      {
        title:'二、 如何实名认证？',
        des:'1. 充值或购买标的物时，在弹出实名认证提示中，点击【实名认证】即可进行操作。\r\n2. 先输入您的真实姓名，点击【身份证】一栏的右边图标进行扫描身份证的正反面。\r\n3. 接着上传身份证照片并核对身份证号码后，点击【完成】按钮即可认证成功。'
      },
      {
        title:'三、 如何绑卡？',
        des:'1. 在完成认证后，出现绑定银行卡页面，输入银行卡号、选择开户行、输入手机号以及短信验证码，点击【完成】按钮。\r\n2.进入设置设置密码页面，设置并确认支付密码后，银行卡绑定成功。'
      },{
        title:'四、 忘记密码怎么办？',
        des:'1、如果您忘记登录密码，您可以直接直接在APP登录页面点击【忘记密码】，重新修改新密码即可；\r\n2、在【个人中心】中，点击【修改支付密码】，即可完成操作。'
    },{
      title:'五、 其他问题',
      des:' 如在注册认证中遇到其他问题，请联系客服：400-158-1996'
    }
    ],
    '账户问题':[
      {
        title:'一、忘记密码？',
        des:'1、如果您忘记登录密码，您可以直接直接在APP登录页面点击【忘记密码】，重新修改新密码即可；\r\n2、如果您忘记支付支付密码，您可以在[个人中心]忘记支付密码进行支付密码修改。',
      },
      {
        title:'二、 账户可以删除吗？',
        des:'账户无法删除，如不再使用请联系客服冻结。客服热线：400-158-1996。',
      },
      {
        title:'三、 账户安全如何保障？',
        des:'1、通通理财实行实名认证机制，用户注册、充值、提现等操作均需要进行实名认证等安全措施；\r\n2、通通理财实行账户与本人一对一实名绑定制度，任何资金的提现只能转出到绑定账户，全面保障资金转出的安全性；\r\n3、通通理财严格按照中国证监会、中国人民银行相关规定，在线对客户身份进行鉴权，以确认投资者开户行为真实、有效。',
      },
      {
        title:'四、 我的个人隐私如何保障？',
        des:'1、通通理财严格遵守国家相关法律法规，对用户的隐私信息进行严格的保密；\r\n2、通通理财设有严格的安保系统，任何人未经允许不可获取用户的相关信息；\r\n3、通通理财承诺不会将用户的账户信息、银行信息、合同信息在未经用户允许的情况下以任何形式透露给第三方。',
      },
    ],
    '银行卡问题':[
      {
        title:'一、 通通理财支持银行限额表',
        des:'银行                单笔限额                日累计限额\n以下16家全国性商业银行\n工商银行          5万元                          5万元\n农业银行          20万元                        20万元\n中国银行          5万元                          10万元\n建设银行          0.5万元                       5万元\n交通银行          0.99万元                     50万元\n招商银行          1000元                        5000元\n民生银行          20万元                        50万元\n兴业银行          5万元                          5万元\n光大银行          5万元                          5万元\n平安银行          5万元                          5万元\n邮储银行          0.5万元                       0.5万元\n浦发银行          5万元                          30万元\n中信银行          0.5万元                       0.5万元\n北京银行          500万元                     500万元\n广发银行          20万元                       50万元\n及银行\n浙商民泰商业银行      2万元                     5万元\n\n注：具体请咨询客服，通通理财客服热线400-158-1996。'
      },
      {
        title:'二、绑卡时提示证件号、姓名或者银行预留号码错误该怎么办',
        des:'若您遇到上述问题，请您联系发卡行核对银行卡的具体证件信息。若仍未解决，请联系通通理财客服热线400-158-1996。',
      },
      {
        title:'三、如何开通银联无卡在线支付功能？',
        des:'部分银行需要先开通银联无卡支付功能，以中国邮政储蓄银行为例，开通银联无卡支付业务只需在电脑上打开链接并参考页面提示填写信息后即可完成开通。开通银联无卡支付请在电脑上打开链接：https://www.95516.com/portal/open/init.do?entry=open\n注：可能需要开通银联无卡在线支付功能的银行有：中国农业银行、中国工商银行和中国邮政储蓄银行',
      },
      {
        title:'四、 其他问题',
        des:' 如有关于银行卡的其他疑问，请咨询：客服电话400-158-1996。',
      },
    ],
    '提现问题':[
      {
        title:'一、我该如何发起提现？',
        des:'您可以进入APP后，点击【我的资产】---【提现】---输入取款金额，即可完成您的提现操作。\n注：每位用户每月前500次提现免手续费，超过500次需要支付手续费2元/笔。',
      },
      {
        title:'二、提现多久到我的银行卡？',
        des:'原则上当天提现当天到账（T+0），具体到账时间视银行处理时间而定。\n注：T为自然日',
      },
      {
        title:'三、为什么我提现失败？',
        des:' 提现失败可能存在以下原因：\n1、网络延迟或响应超时，您可以切换网络或者稍后再试；\n2、银行账户已被冻结；\n3、银行账户正在办理挂失或者已经注销，目前通通理财支持绑定一张银行卡，建议您解绑后绑定新卡操作；',
      },
      {
        title:'四、我提现到已注销的银行卡中该怎么办？',
        des:'如果您遇到这种情况，您的提现订单会在通过第三方支付，在与银行的对接中失败。您的款项会在几个工作日内（具体工作日以第三方支付规定为准）返回您的通通理财账户。',
      },
      {
        title:'五、其他问题',
        des:'如有关于提现的其他疑问，请咨询：客服电话400-158-1996。',
      },

    ],
    '活动问题':[
      {
        title:'一、抵用券和加息券是什么？',
        des:'1、抵用券是提供给通通理财用户的优惠福利，满足投资条件即可在支付时抵扣现金。\n 2、加息券是提供给通通理财用户的优惠福利，满足投资条件即可在支付时获得收益加成。',
      },
      {
        title:'二、我如何获取抵用券和加息券？',
        des:'  抵用券和加息券将通过通通理财APP以及微金石微信公众号内的各种活动进行发放，您可以通过参与活动来获取。',
      },
      {
        title:'三、抵用券和加息券的有效期有多久？',
        des:'根据不同活动所赠送的抵用券和加息券有效期有所不同，如您想详细了解券的有效期情况，您可以进入通通理财APP，点击【我的】---【我的优惠】查看每一张券的具体使用条件。',
      },
      {
        title:'四、抵用券和加息券如何使用？',
        des:'用户在购买产品时，支付页面会出现抵用券和加息券选项（券将按到期时间先后顺序排列，即将过期的券排在前面），选择满足使用条件的抵用券即可直接抵扣现金（加息券择会为您获得标的收益额外的收益率加成），以抵用券为例：用户投资1万元180天的产品，同时用户勾选了符合条件的50元抵用券，则该用户实际投资本金9950元，会按照本金1万元计息，到期回款也是本金1万元+收益。\n注：每张抵用券和加息券仅可使用一次，每次限用一张，仅限本人使用。每张抵用券和加息券均标注有效期，请在有效期内使用，过期将失效。',
      },
    ],
    '安全保障':[
      {
        title:'一、我的资金安全有什么保障？',
        des:' 严格执行中国证券监督管理委员会《客户交易结算资金管理办法》，由银行对客户交易结算资金进行全程监管，确保客户资金安全。\n 1、通通理财与民泰商业银行达成资金存管合作，您的资金往来全程由民泰商业银行存管；\n 2、监管银行对客户每笔交易资金实施监管，确保资金始终处于封闭、可控、可查的状态，监督银行对客户资金的安全承担连带责任；\n3、客户开户时关联绑定本人的银行结算账户，客户资金的转入、转出只能通过绑定账户办理，确保资金流向安全。\n4、遵守同卡进出原则，您的资金无法转出提现至别的银行卡中，只能提现至原银行卡。若因同卡进出原则造成不便请您联系客服：400-158-1996。',
      },
      {
        title:'二、我的账户安全有什么保障？',
        des:'1、通通理财实行实名认证机制，用户注册、充值、提现等操作均需要进行实名认证等安全措施；\n 2、通通理财实行账户与本人一对一实名绑定制度，任何资金的提现只能转出到绑定账户，全面保障资金转出的安全性；\n 3、通通理财严格按照中国证监会、中国人民银行相关规定，在线对客户身份进行鉴权，以确认投资者开户行为真实、有效。',
      },
      {
        title:'三、我的个人隐私如何保密？',
        des:'1、通通理财严格遵守国家相关法律法规，对用户的隐私信息进行严格的保密；\n 2、通通理财设有严格的安保系统，任何人未经允许不可获取用户的相关信息；\n3、通通理财承诺不会将用户的账户信息、银行信息、合同信息在未经用户允许的情况下以任何形式透露给第三方。',
      },
      {
        title:'四、网络安全如何保障？',
        des:'1、通通理财采用顶级信息安全技术SSL加密传输方式，确保传输数据的安全性、保密性、真实性、完整性；\n2、通通理财采用双机热备功能，读写分离，数据备份，增强平台数据库的稳定性；\n3、通通理财采用硬件防火墙技术将数据层、应用层和业务层分离，有效防止病毒入侵和恶意攻击。',
      },
      {
        title:'五、其他问题',
        des:' 如有关于安全的其他疑问，请咨询：客服电话400-158-1996。',
      },
    ],

  }


class ProfileQTDescribeView extends Component {
    props : Props;

    constructor(props) {
      super(props);

   (this:any).renderRow=this.renderRow.bind(this);
     
    this.state={
      feeAmount:'0',
      maxLimitCount:'0',
      userMonthWithdrawCount:'0'
    }
    this.ds=new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,});

    }




  renderRow(rowData){
   return(
     <View>
        <View style={{backgroundColor:'white'}}>
           <Text style={styles.titleText}>
           {rowData.title}
           </Text>
        </View>
        <View>
           <Text style={styles.desText}>
           {rowData.des}
           </Text>
        </View>
     </View>
   )

    }

  render() {
    let back ={
      type:'back'
    }
    let dataSource=source[this.props.title];

    let data = this.ds.cloneWithRows(dataSource);

      return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
           <FlyHeader borderBottom={true} title={this.props.title} leftItem={back} backgroundColor={FlyColors.white} />
            <ListView renderRow={this.renderRow}
                      dataSource={data}/>
        </View>
      );
    }
}

var styles = StyleSheet.create({

  titleText:{
    color:FlyColors.baseTextColor,
    marginTop:10,
    marginLeft:15,
    marginBottom:10,
    marginRight:15,
    fontSize:FlyDimensions.fontSizeXl,
    lineHeight:20

  },
  desText:{
    color:FlyColors.baseTextColor4,
    fontSize:FlyDimensions.fontSizeLarge,
    marginTop:15,
    marginLeft:15,
    marginBottom:15,
    marginRight:10,
    lineHeight:20

  }

});

function select(store) {
    return {

    };

}

module.exports = connect(select)(ProfileQTDescribeView);
