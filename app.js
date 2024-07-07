import {
  getAppAccessToken,
  getAuthorizationCode,
  getUserInfo,
  refeshTOken,
} from "./utils/autherization";

App({
  onLaunch: function () {
    // getAuthorizationCode()
    
    setInterval(getAppAccessToken(), 3600000);

  },

  authorize() {
    const appInstance = getApp();
    getAuthorizationCode()
      .then((code) => {
        console.log(`Authorization code: ${code}`);
        return getAppAccessToken(
          appInstance.GlobalConfig.appId,
          appInstance.GlobalConfig.appSecret
        ).then((tokenData) => {
          getUserAccessToken(tokenData.app_access_token, code).then(
            (userData) => {
              try {
                tt.setStorageSync("user_info", {
                  nickName: userData.data.name,
                  avatarUrl: userData.data.avatar_url,
                });
              } catch (error) {
                console.log(`setStorageSync fail: ${JSON.stringify(error)}`);
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(`Error: ${error.errString} (errno: ${error.errno})`);
      });
  },
  GlobalConfig: {
    baseId: "FeaubtGlja6dtds66P7l6iYbgwd",
    tableId: "tblPjWdyJh5OdMZe",
  },
});
