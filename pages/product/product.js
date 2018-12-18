import {Product} from "../product/product-model.js";
import {Cart} from "../cart/cart-model.js";
var product = new Product();
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabsArr:['商品详情','产品参数','售后保障'],
    countsArr:[1,2,3,4,5,6,7,8,9,10],
    productCounts:1,
    currentTabsIndex:0,
    cartTotalCounts: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this._loadData();
  },

  _loadData:function() {
    this.getDetailInfo();
  },

  getDetailInfo:function() {
    product.getDetailInfo(this.data.id,(data) => {
      this.setData({
        cartTotalCounts:cart.getCartTotalCounts().totalCounts,
        product:data
      });
    });
  },

  /**
   * 选择购买数量
   */
  bindPickerChange:function(event){
    this.setData({
      productCounts:this.data.countsArr[event.detail.value]
    });
  },

  /**
   * 切换详情面板
   */
  onTabsItemTap:function(event){
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  /**
   * 添加到购物车
   */

  onAddingToCartTap:function(event) {
    this.addToCart();
  },

  /**
   * 将商品数据添加到缓存中
   */
  addToCart:function() {
    var tempObj = {}, keys = ['id', 'name', 'main_img_url', 'price'];
    for(var key in this.data.product) {
      if(keys.indexOf(key)>=0){
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj,this.data.productCounts);
    var counts = this.data.cartTotalCounts + this.data.productCounts;
    this.setData({
      cartTotalCounts: counts
    });
  },

  /*跳转到购物车*/
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  }
})
