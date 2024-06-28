import { getAuthorizationCode, getAppAccessToken, getUserInfo } from '../../utils/autherization.js';
import { sendRequest } from '../../utils/sendRequest.js';
import { bodyCreateEvent, botCreateCalendar, botSearchCalendar } from './detailForm.js';
Page({
  data: {
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
    importantOptions: ['A', 'B', 'C'],
    selectedImportant: 'A',
    userInfo: {},
    calendarID: "",
    query:""
  },

  onWeekChange: function (e) {
    this.setData({
      selectedWeek: this.data.weekOptions[e.detail.value]
    });
  },

  onImportantChange: function (e) {
    this.setData({
      selectedImportant: this.data.importantOptions[e.detail.value]
    });
  },
  //click tạo event
  onCreateEvent: function (e) {
    let that=this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/" + that.data.calendarID + "/events";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.access_token}`
        }
        const body = bodyCreateEvent("Alo", "Thông tin chi tiết", "2024-06-29", 1719649800, "2024-06-29", 1719660600, "default");
        sendRequest(url, "POST", headers, body).then((rs) => {
          console.log(rs.data.event.event_id);
        })
      }
    })
  },
  onLoad() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        console.log(res.data.access_token);
        that.setData({ userInfo: res.data })
        that.setData({query: "hihi nhân"})
        console.log(res.data.name);
        // botCreateCalendar(res.data.access_token,"hihi nini","public");
        tt.getStorage({
          key: 'app_access_token',
          success: (resp) => {
            const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/search";
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resp.data}`
            }
            const body =
            {
              "query": that.data.query
            }
            sendRequest(url, 'POST', headers, body).then((rs) => {
              console.log(rs.data.items[0].calendar_id);
              that.setData({calendarID:rs.data.items[0].calendar_id});
            })
          },
          fail: (res) => {
            console.log('goi storage loi :', res.errMsg);
          },
          complete: (res) => {
            console.log('goi xong storage', res.errMsg);
          }
        })
      },
      fail: (res) => {
        console.log('goi storage loi :', res.errMsg);
      },
      complete: (res) => {
        console.log('goi xong storage', res.errMsg);
      }
    })
  },
})
