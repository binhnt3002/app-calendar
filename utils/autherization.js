import { sendRequest } from "./sendRequest";

async function getAuthorizationCode(app_access_token) {
  tt.login({
    success: async function (res) {
      const code = res.code;
      return getUserToken(app_access_token, code).then((result) => {
        tt.setStorageSync("isComplete", true);
        tt.setStorageSync("user_access_token", result.data);

        // refeshTOken(app_access_token, result.data.refresh_token).then((rs) => {
        //   console.log(rs);
        //   tt.setStorageSync("user_access_token", rs.data);
        // });
        getUserInfo(result.data.access_token);

      });
    },
    fail: function (res) {
      console.log("không đăng nhập được : " + res);
    },
  });
}
async function getAppAccessToken() {
  const url = "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal";
  const headers = {
    "content-type": "application/json",
  };
  const body = {
    app_id: "cli_a6f1c211d239d010",
    app_secret: "Xo29OAjgiiE5ANYCIWRR5etAwqGP08dN",
  };

  const result = await sendRequest(url, "POST", headers, body);
  tt.setStorageSync("app_access_token", result.app_access_token);
  await getAuthorizationCode(result.app_access_token);
}

async function getUserToken(app_token, code) {
  const app_access_token = app_token;
  // const url = "https://open.larksuite.com/open-apis/authen/v1/oidc/access_token"
  const url = "https://open.larksuite.com/open-apis/authen/v1/access_token"; //update có thông tin user infor
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + app_access_token,
  };
  const body = {
    grant_type: "authorization_code",
    code: code,
  };
  return sendRequest(url, "POST", headers, body);
}

async function getUserInfo(user_token) {
  const access_token = user_token;
  const url = "https://open.larksuite.com/open-apis/authen/v1/user_info";
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + access_token,
  };
  const result = await sendRequest(url, "GET", headers);
  tt.setStorageSync("user_info", result.data);
}

async function refeshTOken(app_token, refres_tok) {
  const url = "https://open.larksuite.com/open-apis/authen/v1/refresh_access_token";
  const headers = {
    Authorization: `Bearer ${app_token}`,
    "Content-Type": "application/json",
  };
  const body = {
    grant_type: "refresh_token",
    refresh_token: refres_tok,
  };

  return sendRequest(url, "POST", headers, body);
}

export { getAppAccessToken, getUserInfo, getAuthorizationCode, refeshTOken };
