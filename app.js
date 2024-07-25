import {
  getAppAccessToken,
} from "./utils/autherization";

App({
  onLaunch: function () {
    let that = this;
    that.authorize();
  },

  authorize() {
    return getAppAccessToken();
  },
  GlobalConfig: {
    // baseId: "FeaubtGlja6dtds66P7l6iYbgwd",
    // tableId: "tblPjWdyJh5OdMZe",
    baseId: "VdYQbYrvjaElwystb6LljoGxgHd"

  },
});
