import { sendRequest } from "../../utils/sendRequest";
import { getCalendarList, createInvitation } from "../form-submit/function/apiFunction";
import { bodyScheduleParticipants } from "../form-submit/detailForm";
Page({
  data: {
    events: [],
    eventsID: [],
    invite: [],
    inviteOpenId: [],
    avatarUrl:[],
    inviteData: [],
    frequencyOptions: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng '],
    selectedFrequency: 'Hàng ngày',
    permissionOptions : ['Chỉ xem', 'Được mời', 'Được sửa', 'Không'],
    selectedPermission : 'Không',
    calendarID: '',
    lich: [],
    chonlich: '',
    dataLich: [],
    idCongViec:'',
    attendees: [],
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

  onPermissionChange: function (e) {
    this.setData({
      selectedPermission: this.data.permissionOptions[e.detail.value]
    });
  },

  listUser() {
    let that = this;
    let invite = that.data.invite;
    let inviteOpenId = that.data.inviteOpenId;
    let avatarUrl = that.data.avatarUrl;
    let inviteData = that.data.inviteData;
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
            invite.push({name: item.name}),
            inviteOpenId.push(item.openId),
            avatarUrl.push({url: item.avatarUrls[0]})
        })
        
        inviteData = invite.map((item, index) => ({
          name: item.name,
          url: avatarUrl[index] ? avatarUrl[index].url: undefined // Handle potential mismatched lengths
        }));

        that.setData({
          invite,
          inviteOpenId,
          avatarUrl,
          inviteData,
        })

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
    
  },
  onShow(){
    let that = this;
    that.listTask();
  },
  listTask() {
    tt.showToast({
      title: 'Đang lấy dữ liệu',
      icon: 'loading',
    })
    let that = this;
    let events = that.data.events;
    let eventsID = that.data.eventsID;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const url = 'https://open.larksuite.com/open-apis/bitable/v1/apps/FeaubtGlja6dtds66P7l6iYbgwd/tables/tblPjWdyJh5OdMZe/records/search';

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
              "desc": false
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
        sendRequest(url, 'POST', headers, body).then((resp) => {
          tt.showToast({
            title: 'Hoàn tất dữ liệu',
            icon: 'success',
          })
          console.log(resp);
          resp.data.items.map(i => i.fields["Việc cần làm"].map(item => events.push({ name: item.text })[0]));
          resp.data.items.map(i => i.fields["EventID"].map(item => eventsID.push(item.text)[0]));

          const updatedEvents = events.map((event, index) => {
            // Check if the index matches an ID in eventsID (assuming arrays have same length)
            if (index < eventsID.length) {
              return {
                ...event, // Spread existing event properties
                value: eventsID[index],
                checked: false,
              };
            } else {
              // Return the original event if no corresponding ID is found
              return event;
            }
          });
          events = updatedEvents;
          that.setData({ eventsID })
          that.setData({ events })
          console.log(that.data.events);
        })
      }
    })
  },

  checkboxChange: function (e) {
    let that = this;
    let currentValue = e.currentTarget.dataset;
    console.log(currentValue);
    that.setData({
      events: that.data.events.map(i => {
        if (i.value == currentValue.eventid && i.checked == false) {
          i.checked = !currentValue.checked;
        }
        else {
          i.checked = false;
        }
        return i
      }),
      idCongViec: currentValue.eventid
    })
    console.log('Checkbox change，value：', that.data.idCongViec)
    console.log(that.data.events);
  },

  addEventParticipate(){
    let that = this;
    let inviteOpenId = that.data.inviteOpenId;
    let attendees = that.data.attendees;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const access_token = res.data.access_token;
        inviteOpenId.forEach((id, index) => {
          const body = bodyScheduleParticipants("user", id, res);
          createInvitation(access_token,
                           "feishu.cn_faIOwqQ2lmmKlc6qu9NSue@group.calendar.feishu.cn",
                           that.data.idCongViec, body)
            .then((result) => {
              console.log(result);
              // that.setData({attendees})
              tt.showToast({
                title: 'Đã mời',
                icon: 'success',
              });
            })
            .catch((error) => {
              console.error("Error sending invitation:", error);
              // Handle invitation sending errors gracefully (optional)
            });
        });


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
  onLoad(){
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const access_token = res.data.access_token;
        const headers = {
          'Authorization': `Bearer ${res.data.access_token}`,
          'Content-Type': 'application/json'
        }
        sendRequest("https://open.larksuite.com/open-apis/calendar/v4/calendars/feishu.cn_faIOwqQ2lmmKlc6qu9NSue@group.calendar.feishu.cn/events",'GET',headers,{}).then((res)=>{
          console.log(res);
        })
      }
    })
  }

});
