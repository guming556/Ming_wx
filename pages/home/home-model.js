import {Base} from "../../utils/base.js";

class Home extends Base {
  constructor() {
    super();
  }

  /**
   * 获取banner图片信息
   */
  getBannerData(id, callback) {
    var params = {
      url:'banner/' + id,
      sCallback:function(data) {
        data = data.items;
        callback && callback(data);
      }
    };

    this.request(params);
  }

  /**
   * 获取主题数据
   */
  getThemeData(callback){
    var params = {
      url:'theme?ids=1,2,3',
      sCallback:function(data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }

  /**
 * 获取首页新品列表
 */
  getRecentData(callback) {
    var params = {
      url: 'product/recent',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }
}


export {Home};