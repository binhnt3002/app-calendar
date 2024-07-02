import { getAppAccessToken , getAuthorizationCode, getUserInfo} from "./utils/autherization"

App({
  onLaunch: function () {
    getAppAccessToken();
    getAuthorizationCode();
    getUserInfo();
  },
  GlobalConfig: {
    baseId:"FeaubtGlja6dtds66P7l6iYbgwd",
    tableId:"tblPjWdyJh5OdMZe",
  }
})
