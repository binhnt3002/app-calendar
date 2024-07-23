import {
  getAppAccessToken,
  getAuthorizationCode,
  getUserInfo,
  refeshTOken,
} from "./utils/autherization";

App({
  onLaunch: function () {
    let that = this;
    tt.showLoading({
      title: "Loading",
      mask: false,

      success(res) {
        // setInterval(() => {
        // },7200000);
        that.authorize();

        tt.hideLoading({
          success(res) {
            console.log(JSON.stringify(res));
          },
          fail(res) {
            console.log(`hideLoading fail: ${JSON.stringify(res)}`);
          },
        });
        console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log(`showLoading fail: ${JSON.stringify(res)}`);
      },
    });
  },

  authorize() {
    return getAppAccessToken();
  },
  GlobalConfig: {
    baseId: "VUzZbHZIzaP0tKsL4GilYHmBg2c",
    tableId: "tblgmj7nv8cZHI5b",
  },
});
