import { sendRequest } from '../../utils/sendRequest.js';
import { bodyCreateEvent } from './detailForm.js';
Page({
  data: {
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
    importantOptions: ['A', 'B', 'C'],
    selectedImportant: 'A',
    userInfo: {},
    calendarId: "",
    calendarIdPrimary: "",
    query: "",
    timeStart:"",
    timeEnd:"",
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
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/" + that.data.calendarIdPrimary + "/events";
        // const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/feishu.cn_YwYMMtmCwvWIcxO1mXfyVg@group.calendar.feishu.cn/events";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.access_token}`
        }
        const body = bodyCreateEvent("Alo", "Thông tin chi tiết", "1719714600", "1719721800", "default");
        sendRequest(url, "POST", headers, body).then((rs) => {
          console.log(rs.data.event.event_id);
        })
      }
    })
  },

  //click tạo calendar -> lấy id
  onCreateCalendar() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.access_token}`
        }
        const body = {
          "summary": that.data.userInfo.name,
          "description": "Create a calendar by " + that.data.userInfo.name,
          "permissions": "public", //private, public, show_only_free_busy
          "color": -1,
          "summary_alias": "Calendar alias"
        }

        sendRequest(url, 'POST', headers, body).then((rs) => {
          console.log("Tạo thành công");
          that.setData({ calendarId: rs.data.calendar.calendar_id })
        })
      }
    })
  },
  //tìm kiếm lịch với điều kiện
  onSearchCalendar() {
    let that = this;
    tt.getStorage({
      key: 'app_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/search";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data}`
        }
        const body =
        {
          "query": "tittle" //thông tin search
        }
        sendRequest(url, 'POST', headers, body).then((rs) => {
          console.log(rs.data.items);
        })
      }
    })
  },

  //lấy id lịch chính của tài khoản đăng nhập
  getPrimaryCalendar() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/primary?user_id_type=open_id";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.access_token}`
        }
        sendRequest(url, 'POST', headers, null).then((rs) => {
          that.setData({ calendarIdPrimary: rs.data.calendars[0].calendar.calendar_id })
        })
      },
    })
  },

  //lấy danh sách lịch của tài khoản
  getListCalendar() {
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars";
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${res.data.access_token}`
        }
        sendRequest(url, 'GET', headers, null).then((rs) => {
          console.log("List", rs.data.calendar_list);
        })
      },
    })
  },

  onLoad() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        console.log(res.data.access_token);
        that.setData({ userInfo: res.data })
        that.setData({ query: "hihi" })
      },
      fail: (res) => {
        console.log('goi storage loi :', res.errMsg);
      },
      complete: (res) => {
        console.log('goi xong storage', res.errMsg);
      }
    })
  },
  onReady() {
    this.getPrimaryCalendar();
    this.getListCalendar();
  }
})
