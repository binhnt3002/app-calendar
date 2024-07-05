import { sendRequest } from "../../utils/sendRequest";
import { getCalendarList } from "../form-submit/function/apiFunction";
Page({
  data: {
    events: [],
    dataEvents:[],
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
      maxNum: 100,
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
    let events = that.data.events;
    let dataEvt = that.data.dataEvents;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = 'https://open.larksuite.com/open-apis/calendar/v4/calendars/'+that.data.calendarID+'/events';
        const url2 = 'https://open.larksuite.com/open-apis/bitable/v1/apps/FeaubtGlja6dtds66P7l6iYbgwd/tables/tblPjWdyJh5OdMZe/records/search';
        
        const headers = {
          'Authorization': `Bearer ${res.data.access_token}`,
          'Content-Type': 'application/json'
        }
        const body = {
          "field_names": [
            "Việc cần làm",
            "EventID"
          ],
          "sort": [
            {
              "field_name": "Thể loại",
              "desc": true
            }
          ],
          "filter": {
            "conjunction": "and",
            "conditions": [
              {
                "field_name": "Person",
                "operator": "is",
                "value": [
                  res.data.open_id
                ]
              }
            ]
          },
          "automatic_fields": false
        }
        sendRequest(url2, 'POST', headers, body).then((resp) => {
          console.log(resp);
          resp.data.items.map (i => i.fields["Việc cần làm"].map(item => events.push(item.text)[0]));
          resp.data.items.map (i => i.fields["EventID"].map(item => dataEvt.push(item.text)[0]));
          that.setData({dataEvt})
          that.setData({events})
          console.log(that.data.events);
          console.log(that.data.dataEvents);
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
