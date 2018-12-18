import {My} from "./my-model.js";
import {Address} from "../../utils/address.js";
import {Order} from "../order/order-model.js";
 
var my = new My();
var address = new Address();
var order = new Order();
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:1,
    orderArr:[],
    isLoadedAll:false,
    addressInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow:function() {
    this._getOrders(true);
  },

  _loadData() {
    my.getUserInfo((data) => {
      this.setData({
        userInfo:data
      });
    });
    this._getOrders();
  },

  _getOrders: function (isShow) {
    if(isShow) {
      order.getOrders(1, (res) => {
        var data = res.data.data;
          this.setData({
            orderArr: data
          });
      });
    }else{
      order.getOrders(this.data.pageIndex, (res) => {
        var data = res.data.data;
        if (data) {
          this.data.orderArr.push.apply(this.data.orderArr, data);
          this.setData({
            orderArr: this.data.orderArr
          });
        } else {
          this.data.isLoadedAll = true;
        }
      });
    }
  },

  _getAddressInfo:function() {
    address.getAddressInfo((addressInfo) => {
      this._bindAddressInfo(addressInfo);
    });
  },

  editAddress: function (event) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        that._bindAddressInfo(addressInfo);
        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败');
          }
        });
      }
    });
  },

  _bindAddressInfo:function(addressInfo) {
    this.setData({
      addressInfo:addressInfo
    });
  },

  showOrderDetailInfo:function(event) {
    var id = my.getDataSet(event,'id');
    wx.navigateTo({
      url: '../order/order?id='+id+'&from=order'
    })
  },

  rePay:function(event) {
    var id = my.getDataSet(event, 'id');
    this._execPay(id);
  },

  _execPay:function(id){
    var that = this;
    order.execPay(id, (statusCode) => {
      if(statusCode > 0) {
        var flag = statusCode == 2;
        if(flag) {
          wx.navigateTo({
            url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=my',
          });
        }else {
          that.showTips('支付失败','商品已下架或库存不足');
        }
      }
    });
  },

  showTips:function(title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel:false,
      success:function(){
      }
    })
  },

  onReachBottom:function() {
    if(!this.data.isLoadedAll){
      this.data.pageIndex++;
      this._getOrders();
    }
  }
})