import { getAppAccessToken , getAuthorizationCode, getUserInfo} from "./utils/autherization"

App({
 
  onLaunch: function () {
    getAppAccessToken();
    getAuthorizationCode();
    getUserInfo();
  },
  GlobalConfig: {
    appId: 'cli_a6f1c211d239d010',
    app_sec: 'Xo29OAjgiiE5ANYCIWRR5etAwqGP08dN'
  }
})
