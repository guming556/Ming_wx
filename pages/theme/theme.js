import {Theme} from '../theme/theme-model.js';
var theme = new Theme();

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
    this.data.titleName = options.name;
    this.data.id = options.id;
    this._loadData();
  },

  /*加载所有数据*/
  _loadData: function (callback) {
    /*获取单品列表信息*/
    theme.getProductorData(this.data.id, (data) => {
      this.setData({
        themeInfo: data,
      });
      callback && callback();
    });
  },

  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
  
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.titleName
    });
  },
})