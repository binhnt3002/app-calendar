import { sendRequest } from "../../utils/sendRequest";
import { getCalendarList } from "../form-submit/function/apiFunction";
Page({
  data: {
    events: [],
    invite: [],
    inviteOpenId: [],
    frequencyOptions: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng '],
    selectedFrequency: 'Hàng ngày',
    calendarID: '',
    lich: [],
    chonlich: '',
    dataLich: [],
  },

  onLoad() {
    this.setEvents();
  },

  setEvents() {
    const events = this.data.events;
    this.setData({
      events: events
    });
  },

  onLoad() {
    this.setInvites();
  },

  setInvites() {
    const invite = this.data.invite;
    this.setData({
      invite: invite
    });
  },

  onFrequencyChange: function (e) {
    this.setData({
      selectedFrequency: this.data.frequencyOptions[e.detail.value]
    });
  },

  listUser() {
    let that = this;
    let invite = that.data.invite;
    let inviteOpenId = that.data.inviteOpenId;

    tt.chooseContact({
      multi: true,
      ignore: false,
      maxNum: 10,
      limitTips: 10,
      externalContact: true,
      enableChooseDepartment: true,
      disableChosenIds: [
        ...that.data.inviteOpenId
      ],
      success(res) {

        console.log(res);

        res.data.map(item => {
          invite.push(item.name),
            inviteOpenId.push(item.openId)
        })

        that.setData({
          invite,
          inviteOpenId
        })
        console.log(that.data.invite);
        console.log(that.data.inviteOpenId);
      },
      fail(res) {
        console.log(`chooseContact fail: ${JSON.stringify(res)}`);
      }
    });
  },
  onReady() {
    let that = this;
    that.setCalendarDataEvent();
    that.listTask();
  },

  listTask() {
    let that = this;
    let event = that.data.event;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = 'https://open.larksuite.com/open-apis/calendar/v4/calendars/'+that.data.calendarID+'/events';
        const url2 = 'https://open.larksuite.com/open-apis/calendar/v4/calendars/feishu.cn_TsyhUKTHj8mwCqwMQsGiRa@group.calendar.feishu.cn/events';
        const url3='https://open.larksuite.com/open-apis/calendar/v4/calendars/feishu.cn_TsyhUKTHj8mwCqwMQsGiRa@group.calendar.feishu.cn/events/ccd662ac-5b74-422e-aad4-43cbd169b54a_0';
        
        const headers = {
          'Authorization': `Bearer ${res.data.access_token}`,
          'Content-Type': 'application/json'
        }
        sendRequest(url2, 'GET', headers, {}).then((resp) => {
          console.log("ok");
        })
      }
    })
  },
  setCalendarDataEvent() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        tt.showToast({
          title: 'Đang lấy dữ liệu',
          icon: 'loading',
        })
        const access_token = res.data.access_token;
        getCalendarList(access_token).then((result) => {
          console.log(result.data.calendar_list);
          that.setData({
            dataLich: result.data.calendar_list,
            lich: result.data.calendar_list.map(item => item.summary),
          })
        });
      }
    })
  },

});
