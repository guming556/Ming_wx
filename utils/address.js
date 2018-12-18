import {Base} from './base.js';
import {Config} from './config.js';
class Address extends Base{
  constructor() {
    super();
  }

  /**
   * 选择收货地址
   */
  setAddressInfo(res){
    var province = res.provinceName || res.province,
    city = res.cityName || res.city,
    country = res.countyName || res.country,
    detail = res.detailInfo || res.detail;
    var totalDetail = city + country + detail;
    if(!this.isCenterCity(province)) {
      totalDetail = province + totalDetail; 
    }
    return totalDetail;
  }

  /**
   * 获取用户的收货地址
   */
  getAddressInfo(callback){
    var that = this;
    var params = {
      url:'address',
      sCallback:function(res) {
        res.totalDetail = that.setAddressInfo(res);
        callback && callback(res);
      }
    };
    this.request(params);
  }

  /**
   * 判断是否是直辖市
   */
  isCenterCity(name) {
    var centerCitys = ['北京市','天津市','上海市','重庆市'];
    var flag =  centerCitys.indexOf(name) >= 0;
    return flag;
  }

  /**
   * 更新保存地址
   */
  submitAddress(data, callback){
    var data = this._setUpAddress(data);
    var params = {
      url:'address',
      type:'post',
      data:data,
      sCallback:function(res) {
        callback && callback(true);
      },
      eCallback:function(res){
        callback && callback(false);
      }
    };
    this.request(params);
  }

  /**
   * 使地址字段名跟数据库保持一致
   */
  _setUpAddress(data){
    var addressData = {
      name:data.userName,
      province:data.provinceName,
      city:data.cityName,
      country:data.countyName,
      mobile:data.telNumber,
      detail:data.detailInfo
    };
    return addressData;
  }
}
export {Address};