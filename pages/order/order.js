import {Cart} from '../cart/cart-model.js';
import {Order} from './order-model.js';
import {Address} from '../../utils/address.js';
var cart = new Cart();
var order = new Order();
var address = new Address();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.from == 'cart') {
      this._fromCart(options.account);
    }else {
      this._fromOrder(options.id);
    } 
  },

  _fromCart:function(account) {
    var productsArr = cart.getCartDataFromLocal(true);
    this.setData({
      productsArr: productsArr,
      account:account,
      orderStatus: 0
    });

    address.getAddressInfo((res) => {
      this._bindAddressInfo(res);
    });
  },

  _fromOrder:function(id) {
    if (id) {
      var that = this;
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          }
        });
        //地址快照
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },

  onShow:function(){
    var id = this.data.id;
    this._fromOrder(id);
  },

  editAddress:function(event) {
    var that = this;
    wx.chooseAddress({
      success:function(res){
        var addressInfo = {
          name:res.userName,
          mobile:res.telNumber,
          totalDetail:address.setAddressInfo(res)
        }
        that._bindAddressInfo(addressInfo);
        //保存地址
        address.submitAddress(res, (flag) => {
          if(!flag){
            that.showTips('操作提示','地址信息更新失败');
          }
        });
      }
    });
  },

  /**
   * 绑定地址信息
   */
  _bindAddressInfo:function(addressInfo) {
    this.setData({
      addressInfo:addressInfo
    });
  },

  showTips:function(title,content,flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success:function(res) {
        if (flag) {
          wx.switchTab({
            url: 'pages/my/my',
          });
        }
      }
    });
  },

  /**
   * 下单和付款
   */
  pay:function(){
    if(!this.data.addressInfo) {
      this.showTips('下单提示','请填写您的收货地址');
      return;
    }
    if(this.data.orderStatus == 0) {
      this._firstTimePay();
    }else {
      this._oneMoresTimePay();
    }
  },

  /**
   * 第一次支付
   */
  _firstTimePay:function(){
    var orderInfo = [],
    productInfo = this.data.productsArr,
    order = new Order();

    for(let i=0;i<productInfo.length;i++) {
      orderInfo.push({
        product_id:productInfo[i].id,
        count:productInfo[i].counts
      });
    }

    var that = this;
    //支付分成两步，首先是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo, (data) => {
      //订单生成成功
      if(data.pass) {
        var id = data.order_id;
        that.data.id = id;
        that.data.fromCartFlag = false;

        //开始支付
        that._execPay(id);
      }else {
        that._orderFail(data);
      }
    });
  },

  _execPay:function(id){
    var that = this;
    order.execPay(id, (statusCode) => {
      if(statusCode != 0) {
        //将已经下单的商品从购物车删除
        that.deleteProducts();
        var flag =  statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=order'  ,
        });
      }
    });
  },

  /**
   * 下单失败
   */
  _orderFail:function(data) {
    var nameArr = [],
    name = '',
    str = '',
    pArr = data.pStatusArray;
    for(let i=0;i<pArr.length;i++) {
      if(!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length > 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if(nameArr.length > 2) {
      str += '等';
    }
    str += '缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel:false,
      success:function(res) {
      }
    })
  },

//将已经下单的商品从购物车删除
  deleteProducts:function() {
    var ids = [],arr = this.data.productsArr;
    for(let i=0;i<arr.length;i++){
      idds.push(arr[i].id);
    }
    cart.delete(ids);
  }
})
