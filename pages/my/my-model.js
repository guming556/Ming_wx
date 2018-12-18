import {Base} from "../../utils/base.js";

class My extends Base {
  constructor() {
    super();
  }

  getUserInfo(callback) {
    wx.login({
      success:function() {
        wx.getUserInfo({
          success:function(res) {
            callback && callback(res.userInfo);
          },
          fail:function() {
            callback && callback({
              avatarUrl:'../../imgs/icon/user@default.png',
              nickName:'吃货一个'
            });
          }
        });
      }
    });
  }
}

export {My};