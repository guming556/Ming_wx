import {Base} from '../../utils/base.js';

class Order extends Base{

  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }

  /**
   * 下单
   */
  doOrder(params, callback){
    var that = this;
    var allParams = {
      url:'order',
      type:'post',
      data:{products:params},
      sCallback:function(data) {
        that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback:function() {
      }
    };
    this.request(allParams);
  }

  /**
   * 拉起微信支付
   */
  execPay(orderNumber, callback){
    var allParams = {
      url:'pay/pre_order',
      type:'post',
      data:{id:orderNumber},
      sCallback:function(data) {
        var timeStamp = data.timeStamp;
        if(timeStamp) { //可以支付
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success:function() {
              callback && callback(2);
            },
            fail:function() {
              callback && callback(1);
            }
          });
        }else {
          callback && callback(0);
        }
      }
    };
    this.request(allParams);
  }

  getOrderInfoById(id, callback){
    var allParams = {
      url:'order/'+id,
      sCallback:function(data) {
        callback && callback(data);
      },
      eCallback:function() {
      }
    };
    this.request(allParams);
  }

  getOrders(pageIndex,callback) {
    var allParams = {
      url:'order/by_user',
      data:{page:pageIndex},
      sCallback:function(res) {
        callback && callback(res);
      }
    };
    this.request(allParams);
  }

  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data);
  }
}

export {Order};