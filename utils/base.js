import {Config} from "../utils/config.js";
import {Token} from './token.js';

class Base{
  constructor() {
    "use strict";
    this.baseRestUrl = Config.restUrl;
  }

  //http请求类封装
  request(params, onRefecth) {
    var that = this,
    url = this.baseRestUrl + params.url;

    if(!params.type) {
      params.type = "get";
    }

    if(params.serUpUrl == false) {
      url = params.url;
    }

    wx.request({
      url: url,
      data:params.data,
      method:params.type,
      header:{
        "Content-Type": "application/json",
        'token':wx.getStorageSync('token')
      },
      success:function(res) {
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if(startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        }else {
          if(code == '401') {
            if (!onRefecth) {
              that._refecth(params);
            }
          }
          params.eCallback && params.eCallback(res.data);
        }
      },

    })
  }

  _refecth(params) {
    var token = new Token();
    token.getTokenFromServer();
    this.request(params, true);
  }
  /**
   * 获得元素上绑定的值
   */
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }
}

export {Base};