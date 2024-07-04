import { getAppAccessToken , getAuthorizationCode, getUserInfo} from "./utils/autherization"

App({
  onLaunch: async function () {
    await getAppAccessToken();
    await getAuthorizationCode();
    await getUserInfo();
  },
  GlobalConfig: {
    baseId:"FeaubtGlja6dtds66P7l6iYbgwd",
    tableId:"tblPjWdyJh5OdMZe",
  }
})
