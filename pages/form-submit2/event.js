import { sendRequest } from "../../utils/sendRequest";
import { getCalendarList, createInvitation, getGroupId, getEvent, updateEvent } from "../form-submit/function/apiFunction";
import { bodyScheduleParticipants, bodyUpdateEvent } from "../form-submit/detailForm";
Page({
  data: {
    events: [],
    eventsID: [],
    invite: [],
    inviteOpenId: [],
    avatarUrl: [],
    inviteData: [],
    frequencyOptions: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng '],
    selectedFrequency: 'Hàng ngày',
    permissionOptions: ['Chỉ xem', 'Được mời', 'Được sửa', 'Không'],
    selectedPermission: 'Không',
    calendarID: '',
    arCalendarId: [],
    idCongViec: '',
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
        res.data.map(item => {
          invite.push({ name: item.name }),
            inviteOpenId.push(item.openId),
            avatarUrl.push({ url: item.avatarUrls[0] })
        })

        inviteData = invite.map((item, index) => ({
          id: index,
          name: item.name,
          url: avatarUrl[index] ? avatarUrl[index].url : undefined // Handle potential mismatched lengths
        }));

        that.setData({
          invite,
          inviteOpenId,
          avatarUrl,
          inviteData,
        })

        console.log(that.data.inviteData);
      },
      fail(res) {
        console.log(`chooseContact fail: ${JSON.stringify(res)}`);
      }
    });
  },

  onShow() {
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
    let arCalendarId = that.data.arCalendarId;
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
            "EventID",
            "CalendarID"
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
          events = [],
            eventsID = [],
            arCalendarId = [],
            resp.data.items.map(i => i.fields["Việc cần làm"].map(item => events.push({ name: item.text })[0]));
          resp.data.items.map(i => i.fields["EventID"].map(item => eventsID.push(item.text)[0]));
          resp.data.items.map(i => i.fields["CalendarID"].map(item => arCalendarId.push(item.text)[0]));

          const updatedEvents = events.map((event, index) => {
            // Check if the index matches an ID in eventsID (assuming arrays have same length)
            if (index < eventsID.length) {
              return {
                ...event, // Spread existing event properties
                value: eventsID[index],
                id: arCalendarId[index],
                checked: false,
              };
            } else {
              // Return the original event if no corresponding ID is found
              return event;
            }
          });

          events = updatedEvents;
          that.setData({ eventsID, events, arCalendarId })
          console.log(that.data.events);
        })
      }
    })
  },

  checkboxChange: function (e) {
    let that = this;
    let currentValue = e.currentTarget.dataset;
    console.log(currentValue);
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        getEvent(res.data.access_token, currentValue.calendar, currentValue.eventid).then((rs) => {
          // console.log(rs);
          that.setData({
            events: that.data.events.map(i => {
              if (i.value == currentValue.eventid && i.checked == false) {
                i.checked = !currentValue.checked;
              }
              else {
                i.checked = false;
              }
              return i
            })
          })
          if (rs.data.event.status !== "confirmed" || currentValue.checked == true) {
            tt.showToast({
              title: 'Chưa chọn hoặc công việc không tồn tại',
              icon: 'error',
            });
            that.setData({
              idCongViec: '',
              calendarID: ''
            })
          }
          else {
            that.setData({
              idCongViec: currentValue.eventid,
              calendarID: currentValue.calendar
            })

          }
          console.log(that.data.events);
        })
      }
    })
  },

  addEventParticipate() {
    let that = this;
    let inviteOpenId = that.data.inviteOpenId;
    let attendees = that.data.attendees;
    if (that.data.idCongViec != '' && that.data.calendarID != '' && inviteOpenId.length > 0) {
      tt.getStorage({
        key: 'user_access_token',
        success: (res) => {
          const access_token = res.data.access_token;
          inviteOpenId.forEach((id, index) => {
            const body = bodyScheduleParticipants("user", id, res);
            createInvitation(access_token,
              that.data.calendarID,
              that.data.idCongViec, body)
              .then((result) => {
                console.log(result);
                // that.setData({attendees})
                tt.showToast({
                  title: 'Đã mời',
                  icon: 'success',
                });
                that.setData({
                  events: that.data.events.map(i => { i.checked = false; return i }),
                  inviteOpenId: [],
                  invite: [],
                  inviteData: [],
                  avatarUrl: []
                })
              })
              .catch((error) => {
                console.error("Error sending invitation:", error);
                // Handle invitation sending errors gracefully (optional)
              });
          });
        }
      })
    } else {
      tt.showToast({
        title: 'Vui lòng đủ thông tin',
        icon: 'error',
      });
    }

  },

  removeElement: function (e) {
    console.log(e);
    let that = this
    let index = e.currentTarget.id;
    
    const iO = [...that.data.inviteOpenId];
    iO.splice(index, 1);
    const newData = [...that.data.inviteData]; // Create a copy of the array
    newData.splice(index, 1); // Remove the element at the specified index
    const newAvartarUrl = [...that.data.avatarUrl];
    newAvartarUrl.splice(index, 1);
    const newInvite = [...that.data.invite];
    newInvite.splice(index, 1)

    that.setData({
      inviteData: newData,
      inviteOpenId: iO,
      avatarUrl: newAvartarUrl,
      invite: newInvite
    }); // Update the data in the component
  },

  onLoad() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const access_token = res.data.access_token;
        const headers = {
          'Authorization': `Bearer ${res.data.access_token}`,
          'Content-Type': 'application/json'
        }
        getGroupId(access_token).then((rs) => {
          console.log(rs);
        })
      }
    })
  }
});
