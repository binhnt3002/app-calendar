import { getAppAccessToken , getAuthorizationCode, getUserInfo} from "./utils/autherization"

App({
  onLaunch: function () {
    getAppAccessToken();
    getAuthorizationCode();
    getUserInfo();
  },
  GlobalConfig: {
    baseId:"",
    tableId:"",
  }
})
