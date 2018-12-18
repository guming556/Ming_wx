import {Home} from "../home/home-model.js";
var home = new Home();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData:function() {
    this.getBannerData();
    this.getThemeData();
    this.getRecentData();
  },

  getBannerData:function() {
    var id = 1;
    home.getBannerData(id, (data) => {
      this.setData({
        bannerArr: data
      });
    });
  },

  getThemeData:function() {
    home.getThemeData((data) => {
      this.setData({
        themeArr:data
      });
    });
  },

  getRecentData:function(){
    home.getRecentData((data) => {
      this.setData({
        recentArr:data
      });
    });
  },
  
  /*跳转到主题列表*/
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    })
  },
  
  /**
   * 跳转到商品详情
   */
  onProductsItemTap:function(event) {
    var id = home.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
})
