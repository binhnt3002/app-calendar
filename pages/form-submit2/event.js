import { sendRequest } from "../../utils/sendRequest";
import {
  getCalendarList,
  createInvitation,
  getGroupId,
  getEvent,
  updateRecord,
  getAllTableName,
  getListBusy,
  isDuringAnyBusyPeriod,
} from "../function/apiFunction";
import {
  bodyScheduleParticipants,
  bodyScheduleParticipantsGroup,
} from "../form-submit/detailForm";

const appVar = getApp();
Page({
  data: {
    events: [],
    eventsID: [],
    invite: [],
    inviteOpenId: [],
    avatarUrl: [],
    inviteData: [],
    inviteData2: [],
    checkId: [],
    checkInvite: [],
    checkStatue: [],
    checkChatId: [],
    checkChatInvite: [],
    checkChatStatue: [],

    chat: [],
    chatId: [],
    chatAvatar: [],
    chatData: [],

    frequencyOptions: ["Hàng ngày", "Hàng tuần", "Hàng tháng "],
    selectedFrequency: "Hàng ngày",
    permissionOptions: ["Chỉ xem", "Được mời", "Được sửa", "Không"],
    selectedPermission: "Không",
    invitePersonOptions: ["Cá nhân", "Nhóm"],
    selectedInvitePerson: "Cá nhân",
    calendarID: "",
    arCalendarId: [],
    idCongViec: "",
    idGroup: "",
    attendees: [],
    thu: [],
    theloai: [],
    recordid: [],
    ngaygiobatdau:[],
    ngaygioketthuc: [],
    checkBusy: [],
    ngaylam: [],
    getRecord: "",

    tableName: [],
  },

  onLoad() {
    this.setEvents();
  },

  setEvents() {
    const events = this.data.events;
    this.setData({
      events: events,
    });
  },

  onLoad() {
    this.setInvites();
  },

  setInvites() {
    const invite = this.data.invite;
    this.setData({
      invite: invite,
    });
  },

  onInvitePerson: function (e) {
    let events = this.data.events;
    this.setData({
      selectedInvitePerson: this.data.invitePersonOptions[e.detail.value],
    });
    for (let i = 0; i < this.data.events.length; i++) {
      events[i].checked = false; // Change to your desired name
    }
    this.setData({
      events,
    });
  },

  onFrequencyChange: function (e) {
    this.setData({
      selectedFrequency: this.data.frequencyOptions[e.detail.value],
    });
  },

  onPermissionChange: function (e) {
    this.setData({
      selectedPermission: this.data.permissionOptions[e.detail.value],
    });
  },

  listUser() {
    let that = this;
    let invite = that.data.invite;
    let inviteOpenId = that.data.inviteOpenId;
    let avatarUrl = that.data.avatarUrl;
    let inviteData = that.data.inviteData;
    let chat = that.data.chat;
    let chatId = that.data.chatId;
    let chatAvatar = that.data.chatAvatar;
    let chatData = that.data.chatData;
    if (that.data.selectedInvitePerson == "Cá nhân") {
      tt.chooseContact({
        multi: true,
        ignore: false,
        maxNum: 100,
        limitTips: 10,
        externalContact: true,
        enableChooseDepartment: true,
        disableChosenIds: [...that.data.inviteOpenId, ...that.data.checkId],
        success(res) {
          console.log(res);
          res.data.map((item) => {
            invite.push({ name: item.name }),
              inviteOpenId.push(item.openId),
              avatarUrl.push({ url: item.avatarUrls[0] }),
              inviteData.push({
                name: item.name,
                id: item.openId,
                url: item.avatarUrls[0],
              });
          });
          
          
          // inviteData = invite.map((item, index) => ({
          //   id: inviteOpenId[index],
          //   name: item.name,
          //   url: avatarUrl[index] ? avatarUrl[index].url : undefined, // Handle potential mismatched lengths
          // }));

          that.setData({
            invite,
            inviteOpenId,
            avatarUrl,
            inviteData,
            inviteData2: inviteData,
          });

          console.log(that.data.inviteData);
        },
        fail(res) {
          console.log(`chooseContact fail: ${JSON.stringify(res)}`);
        },
      });
    } else {
      (chat = []),
        (chatId = []),
        (chatAvatar = []),
        (chatData = []),
        tt.getStorage({
          key: "user_access_token",
          success: (res) => {
            const access_token = res.data.access_token;
            const headers = {
              Authorization: `Bearer ${res.data.access_token}`,
              "Content-Type": "application/json",
            };
            getGroupId(access_token).then((rs) => {
              console.log(rs);
              rs.data.items.map((i) => {
                chat.push(i.name),
                  chatAvatar.push(i.avatar),
                  chatId.push(i.chat_id);
              });
              chatData = chat.map((item, index) => ({
                id: chatId[index],
                name: item,
                url: chatAvatar[index],
                checked: false,
              }));
              if(that.data.checkChatStatue.length===0){
                console.log(1);
                that.setData({
                  chatData
                })
              } else {
                chatData = chatData.filter(obj => !that.data.checkChatInvite.map(i =>i.name).includes(obj.name));
                console.log(chatData);
                that.setData({
                  chatData
                })
              }
              
              that.setData({
                chat,
                chatId,
                chatAvatar,
              });
            });
          },
        });
    }
  },

  onShow() {
    let that = this;
    setTimeout(() => that.listTask(), 2000);
  },

  listTask() {
    tt.showToast({
      title: "Đang lấy dữ liệu",
      icon: "loading",
    });
    let that = this;
    let events = that.data.events;
    let eventsID = that.data.eventsID;
    let arCalendarId = that.data.arCalendarId;
    let thu = that.data.thu;
    let theloai = that.data.theloai;
    let recordid = that.data.recordid;
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${appVar.GlobalConfig.tableId}/records/search`;

        const headers = {
          Authorization: `Bearer ${res.data.access_token}`,
          "Content-Type": "application/json",
        };
        const body = {
          field_names: [
            "Việc cần làm",
            "Thể loại",
            "Thứ",
            "Ngày - Giờ bắt đầu",
            "Ngày - Giờ kết thúc",
            "Ngày làm",
            "Ghi chú",
            "EventID",
            "CalendarID",
          ],
          sort: [
            {
              field_name: "Ngày - Giờ bắt đầu",
              desc: true,
            },
          ],
          filter: {
            conjunction: "and",
            conditions: [
              {
                field_name: "Person",
                operator: "is",
                value: [res.data.open_id],
              },
            ],
          },
          automatic_fields: false,
        };
        sendRequest(url, "POST", headers, body).then((resp) => {
          tt.showToast({
            title: "Hoàn tất dữ liệu",
            icon: "success",
          });
          console.log(resp);
          (events = []),
            (eventsID = []),
            (arCalendarId = []),
            resp.data.items.forEach((item) => {
              // Check if "Việc cần làm" exists and has text
              if (
                item.fields["Việc cần làm"][0] &&
                item.fields["Việc cần làm"][0].text
              ) {
                events.push({ name: item.fields["Việc cần làm"][0].text });
              } else {
                events.push({ name: "" });
              }

              // Extract other fields directly
              eventsID.push(item.fields["EventID"][0].text);
              arCalendarId.push(item.fields["CalendarID"][0].text);
              thu.push(item.fields["Thứ"].value[0].text);
              theloai.push(item.fields["Thể loại"]);
              recordid.push(item.record_id);
            });
          const updatedEvents = events.map((event, index) => {
            // Check if the index matches an ID in eventsID (assuming arrays have same length)
            if (index < eventsID.length) {
              return {
                ...event, // Spread existing event properties
                value: eventsID[index],
                id: arCalendarId[index],
                checked: false,
                thu: thu[index],
                theloai: theloai[index],
                recordid: recordid[index],
              };
            } else {
              // Return the original event if no corresponding ID is found
              return event;
            }
          });

          events = updatedEvents;
          that.setData({ eventsID, events, arCalendarId, thu, recordid });
        });
      },
    });
  },

  checkboxChange: function (e) {
    let that = this;
    that.setData({
      invite: [],
      inviteOpenId: [],
      inviteData: [],
      chat: [],
      chatId: [],
      chatAvatar: [],
      chatData: [],
      checkInvite: [],
      checkStatue: [],
      checkId: [],
      checkChatInvite: [],
      checkChatStatue: [],
      checkChatId: [],
    });
    let currentValue = e.currentTarget.dataset;
    let checkStatue = that.data.checkStatue;
    let checkInvite = that.data.checkInvite;
    let checkId = that.data.checkId;
    let checkChatStatue = that.data.checkChatStatue;
    let checkChatInvite = that.data.checkChatInvite;
    let checkChatId = that.data.checkChatId;

    Id = that.data.checkId;
    console.log(currentValue);
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        getEvent(
          res.data.access_token,
          currentValue.calendar,
          currentValue.eventid
        ).then((rs) => {
          console.log(rs);
          const checkBusy = 
          {start: that.convertTimestampToDate(rs.data.event.start_time.timestamp*1000), 
            end: that.convertTimestampToDate(rs.data.event.end_time.timestamp*1000)}
          that.setData({checkBusy: checkBusy})
          that.setData({
            events: that.data.events.map((i) => {
              if (i.value == currentValue.eventid && i.checked == false) {
                i.checked = !currentValue.checked;
              } else {
                i.checked = false;
              }
              return i;
            }),
          });
          if (
            rs.data.event.status !== "confirmed" ||
            currentValue.checked == true
          ) {
            tt.showToast({
              title: "Chưa chọn hoặc công việc không tồn tại",
              icon: "error",
            });
            that.setData({
              idCongViec: "",
              calendarID: "",
              getRecord: "",
            });
          } else {
            that.setData({
              idCongViec: currentValue.eventid,
              calendarID: currentValue.calendar,
              getRecord: currentValue.recordid,
            });

            const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${that.data.calendarID}/events/${that.data.idCongViec}/attendees`;
            const headers = {
              Authorization: `Bearer ${res.data.access_token}`,
            };
            sendRequest(url, "GET", headers, {}).then((resp) => {
              let lengthItems = resp.data?.items.length || 0;
              let data = resp.data.items;
              // let dataPush = resp.data.items.map((item) => item.user_id);

              if (lengthItems != 0) {
                if (that.data.selectedInvitePerson == "Cá nhân") {
                  checkStatue = data
                    .filter((i) => i.attendee_id.startsWith("user_"))
                    .map((item) => ({
                      name: item.display_name,
                      status: item.rsvp_status,
                      id: item.user_id,
                    }));
                  // checkStatue = resp.data.items.map((item) => ({ "name": item.display_name, "status": item.rsvp_status, "id": item.user_id })),
                  checkId = resp.data.items.map((item) => item.user_id);
                  const url2 =
                    "https://open.larksuite.com/open-apis/contact/v3/users/batch?user_ids=" +
                    checkId.join("&user_ids=");
                  const headers2 = {
                    Authorization: `Bearer ${res.data.access_token}`,
                  };
                  that.setData({
                    checkStatue,
                    checkId,
                    checkInvite: checkStatue,
                  });
                  sendRequest(url2, "GET", headers2, {}).then((rss) => {
                    checkInvite = checkStatue.map((obj, index) => {
                      return {
                        ...obj,
                        url:
                          rss.data.items.map((i) => ({
                            url: i.avatar.avatar_72,
                          }))[index]?.url || null,
                      };
                    });
                    that.setData({ checkInvite });
                  });
                } else {
                  checkChatStatue = data
                    .filter((i) => i.attendee_id.startsWith("chat_"))
                    .map((item) => ({
                      name: item.display_name,
                      status: item.rsvp_status,
                      id: item.user_id,
                    }));
                  checkChatId = data
                    .filter((i) => i.attendee_id.startsWith("chat_"))
                    .map((item) => item.chat_id);
                  checkChatInvite = checkChatStatue;
                  that.setData({
                    checkChatStatue,
                    checkChatId,
                    checkChatInvite,
                  });
                }
                return;
              }
            });
          }
          console.log(that.data.events);
        });
      },
    });
  },

  checkGroupChange: function (e) {
    let that = this;
    let currentValue = e.currentTarget.dataset;
    console.log(currentValue);
    that.setData({
      chatData: that.data.chatData.map((i) => {
        if (i.id == currentValue.chat && i.checked == false) {
          i.checked = !currentValue.checked;
        } else {
          i.checked = false;
        }
        return i;
      }),
    });
    if (currentValue.checked != false) {
      that.setData({ idGroup: "" });
    } else {
      that.setData({ idGroup: currentValue.chat });
    }

    console.log(that.data.chatData);
  },

  addEventParticipate() {
    let that = this;
    let inviteOpenId = that.data.inviteOpenId;
    let idGroup = that.data.idGroup;

    const isIndividual = that.data.selectedInvitePerson === "Cá nhân";
    const idValid = that.data.idCongViec !== "" && that.data.calendarID !== "";
    const inviteValid = isIndividual ? inviteOpenId.length > 0 : idGroup !== "";

    if (idValid && inviteValid) {
      tt.getStorage({
        key: "user_access_token",
        success: (res) => {
          const access_token = res.data.access_token;

          const createInvitations = (body) => {
            createInvitation(
              access_token,
              that.data.calendarID,
              that.data.idCongViec,
              body
            )
              .then((result) => {
                console.log(result);
                tt.showToast({
                  title: "Đã mời",
                  icon: "success",
                });
                that.setData({
                  events: that.data.events.map((i) => {
                    i.checked = false;
                    return i;
                  }),
                  inviteOpenId: [],
                  invite: [],
                  inviteData: [],
                  avatarUrl: [],
                  checkInvite: [],
                  checkStatue: [],
                  checkId: [],
                  chatData: [],
                  chat: [],
                  chatId: [],
                  chatAvatar: [],
                  checkChatInvite: [],
                  checkChatStatue: [],
                  checkChatId: [],
                });
              })
              .catch((error) => {
                console.error("Error sending invitation:", error);
                // Handle invitation sending errors gracefully (optional)
              });
          };

          if (isIndividual) {
            const body2 = {
              "fields": {
                "Người làm *" : [{"id" : that.data.inviteData2[0].id}],
                "Mời": this.data.inviteData2.map((i) => ({"id" : i.id})),
              },
            };
            updateRecord(tt.getStorageSync("app_access_token"), body2, appVar.GlobalConfig.tableId).then(
              (res) => {
                console.log(res);
              }
            );

            inviteOpenId.forEach((id) => {
              const body = bodyScheduleParticipants("user", id, res);
              createInvitations(body);
            });
          } else {
            const bodyGroup = bodyScheduleParticipantsGroup(
              "chat",
              idGroup,
              res
            );
            createInvitations(bodyGroup);
          }
        },
      });
    } else {
      tt.showToast({
        title: "Vui lòng đủ thông tin",
        icon: "error",
      });
    }
  },

  removeElement: function (e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.id;

    const iO = [...that.data.inviteOpenId];
    const newData = [...that.data.inviteData];
    const newAvartarUrl = [...that.data.avatarUrl];
    const newInvite = [...that.data.invite];

    const indexToRemove = newData.findIndex((item) => item.id === index); // Find element index

    if (indexToRemove !== -1) {
      newData.splice(indexToRemove, 1);
      iO.splice(indexToRemove, 1);
      newAvartarUrl.splice(indexToRemove, 1);
      newInvite.splice(indexToRemove, 1); // Remove the element at the found index
      this.setData({
        inviteData: newData,
        inviteOpenId: iO,
        avatarUrl: newAvartarUrl,
        invite: newInvite,
      }); // Update the data in the component
    } else {
      console.error("Element with ID", index, "not found in chatData"); // Handle potential errors
    }
  },
  removeElement2: function (e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.id;

    const newChatId = [...that.data.chatId];
    const newChatData = [...that.data.chatData];
    const newChatAvatar = [...that.data.chatAvatar];
    const newChat = [...that.data.chat];

    const indexToRemove = newChatData.findIndex((item) => item.id === index); // Find element index

    if (indexToRemove !== -1) {
      newChatData.splice(indexToRemove, 1);
      newChatId.splice(indexToRemove, 1);
      newChatAvatar.splice(indexToRemove, 1);
      newChat.splice(indexToRemove, 1); // Remove the element at the found index
      this.setData({
        chatData: newChatData,
        chatId: newChatId,
        chatAvatar: newChatAvatar,
        chat: newChat,
      }); // Update the data in the component
    } else {
      console.error("Element with ID", index, "not found in chatData"); // Handle potential errors
    }
  },

  convertTimestampToDate(timestamp) {
    // Create a new Date object with the given timestamp
    const date = new Date(timestamp);
    // Get the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    // Format the date as dd/mm/yyyy
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  },
});
