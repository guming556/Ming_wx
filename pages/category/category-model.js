import {Base} from "../../utils/base.js";

class Category extends Base{
  constructor() {
    super();
  }

  /**
   * 获得所有的分类名
   */
  getCategoryTypeData(callback) {
    var params = {
      url:"category/all",
      sCallback:function(data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }

  /**
   * 根据分类获取商品
   */
  getProductsByCategory(id, callback) {
    var params = {
      url:'product/by_category?id=' + id,
      sCallback:function(data){
        callback && callback(data);
      }
    };
    this.request(params);
  }
}

export {Category};