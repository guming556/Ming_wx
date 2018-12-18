import {Category} from "../category/category-model.js";
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData:function() {
    this.getCategoryTypeData();
  },

  getCategoryTypeData:function(){
    category.getCategoryTypeData((categoryData) => {
      this.setData({
        categoryTypeArr: categoryData
      });
      category.getProductsByCategory(categoryData[0].id, (data) => {
        var categoryInfo = {
          products:data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }
        this.setData({
          categoryInfo: categoryInfo
        });
      });
    });
  },
  
  /**
   * 切换分类
   */
  changeCategory:function(event){
    var id = category.getDataSet(event, 'id');
    var index = category.getDataSet(event, 'index');
    this.setData({
      currentMenuIndex:index
    });
    category.getProductsByCategory(this.data.categoryTypeArr[index].id, (data) => {
      var categoryInfo = {
        products: data,
        topImgUrl: this.data.categoryTypeArr[index].img.url,
        title: this.data.categoryTypeArr[index].name
      }
      this.setData({
        categoryInfo: categoryInfo
      });
    });
  },

  /**
   * 跳转到商品详情
   */
  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  }
})