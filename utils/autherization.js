import { sendRequest } from "./sendRequest";


async function getAuthorizationCode() {
    tt.login({
        success: function (res) {
            getUserToken(res.code);
        },
        fail: function(res) {
            console.log("không đăng nhập được : " + res);
        }
    })
}
async function getAppAccessToken() {
    const url = "https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal"
    const headers = {
        'content-type': 'application/json',
    }
    const body = {
        "app_id": "cli_a6f1c211d239d010",
        "app_secret": "Xo29OAjgiiE5ANYCIWRR5etAwqGP08dN"
    }

    sendRequest(url, "POST", headers, body).then((result) => {
        console.log(result);
        tt.setStorage({
            key:"app_access_token",
            data:result.app_access_token
        })
    });
}

async function getUserToken(code) {
    tt.getStorage({
        key: 'app_access_token',
        success: function (res) {
            const app_access_token = res.data
            // const url = "https://open.larksuite.com/open-apis/authen/v1/oidc/access_token"
            const url = 'https://open.larksuite.com/open-apis/authen/v1/access_token'; //update có thông tin user infor
            const headers = {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + app_access_token
            }
            const body = {
                "grant_type": "authorization_code",
                "code": code
            }
            sendRequest(url, "POST", headers, body).then((result) => {
                tt.setStorage({
                    key:"user_access_token",
                    data: result.data
                })
            });
        }

        , fail: function (res) {
            console.log("không đăng nhap user token : " + res);
        }

        , complete: function (res) {
            console.log("đăng nhap user token ");
        }   

    });
}


async function getUserInfo() {
    tt.getStorage({
        key : 'user_access_token',
        success: function(res) {
            const access_token = res.data.access_token;
            const url = "https://open.larksuite.com/open-apis/authen/v1/user_info";
            const headers = {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            }
            sendRequest(url, "GET", headers).then((result) => {
                tt.setStorage({
                    key:"user_info",
                    data: result.data
                })
            });
        },
        fail(res) {
            console.log("lỗi không lấy được userInfo : " + res);
        },
        complete(res) {
            console.log("lấy thành công userInfo ");
        }
    })
}

export { getAppAccessToken , getUserInfo, getAuthorizationCode}