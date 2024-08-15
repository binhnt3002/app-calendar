import { sendRequest } from "../../utils/sendRequest";
import {
  getCalendarList,
  createInvitation,
  getGroupId,
  getEvent,
  updateRecord,
  getListBusy,
  findAvailableIds,
  createRecord,
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
    quantrong: [],
    capbach: [],
    sogiocanco: [],
    ghichu: [],
    recordid: [],
    loai: [],
    ngaygiobatdau: [],
    ngaygioketthuc: [],
    ngaybatdau: "",
    ngayketthuc: "",
    checkBusy: [],
    ngaylam: [],
    getRecord: "",
    listBusy: [],
    tableName: [],

    conflict: "", // Biến lưu thời gian trùng lặp
    participants: [],

    turnPopup: false,
    turnMode: false,
    hiddenCheck: true,
    disabledCont: true,
  },

  onAgree(e) {
    const index = e.currentTarget.dataset.index;
    let participants = this.data.participants;
    participants[index].status = "Đã đồng ý";
    this.setData({ participants });
    console.log(`Người tham gia thứ ${index + 1} đã đồng ý.`);
  },

  onDecline(e) {
    const index = e.currentTarget.dataset.index;
    let participants = this.data.participants;
    participants[index].status = "Từ chối";
    this.setData({ participants });
    console.log(`Người tham gia thứ ${index + 1} đã từ chối.`);
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

  checkPopup() {
    this.setData({
      turnPopup: true,
      turnMode: true,
    });
  },

  exit(e) {
    this.setData({ turnPopup: false, turnMode: false });
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
    let inviteDataTemp = [];
    if (that.data.selectedInvitePerson == "Cá nhân") {
      tt.chooseContact({
        multi: true,
        ignore: true,
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
            inviteDataTemp.push({
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
            disabledAdd: true,
            disabledInvite: true,
          });

          tt.showToast({
            title: `Vui lòng chờ kiểm tra!!!`,
            icon: "loading",
            duration: 5000,
          });

          tt.getStorage({
            key: "user_access_token",
            success: (res) => {
              const access_token = res.data.access_token;
              const userIds = [
                {
                  name: "Nhân",
                  id: "ou_863eed51f511be97513ca7801ae65337",
                  url: "urlnhan",
                },
                {
                  name: "Bình",
                  id: "ou_9b04dc2474d1e22201cb1dbc6017c7e9",
                  url: "urlbinh",
                },
                {
                  name: "Sang",
                  id: "ou_89cf7dbb96c9e44e7ab35e44c9eee208",
                  url: "urlsang",
                },
              ]; // Assuming 'array' contains user IDs
              const bodyArray = inviteDataTemp.map((userId) => {
                return {
                  time_min: that.data.ngaybatdau + "T00:00:00Z",
                  time_max: that.data.ngayketthuc + "T23:59:59Z",
                  user_id: userId.id,
                };
              });
              console.log(bodyArray);

              const resultsArray = [];
              const participants = [];
              bodyArray.map((body) => {
                return getListBusy(access_token, body).then((rs) => {
                  const t = rs.data?.freebusy_list
                    ? rs.data.freebusy_list.length
                    : 0;
                  console.log(t);
                  if (t !== 0) {
                    const userId = body.user_id;
                    const enrichedRs = rs.data?.freebusy_list?.map((item) => ({
                      start: that.convertUTCtoGMT7Timestamp(item.start_time),
                      end: that.convertUTCtoGMT7Timestamp(item.end_time),
                      id: userId,
                    }));
                    resultsArray.push(...enrichedRs);
                    // console.log(resultsArray);
                  }
                  // return rs; // Return rs for Promise.all to resolve
                });
              });

              setTimeout(() => {
                resultsArray.forEach((result) => {
                  const matchingInvite = inviteDataTemp.find(
                    (invite) => invite.id === result.id
                  );
                  if (matchingInvite) {
                    result.name = matchingInvite.name;
                    result.url = matchingInvite.url;
                  }
                });
                that.setData({ listBusy: resultsArray });
              }, 2000);
              setTimeout(() => {
                const availableIds = findAvailableIds(
                  that.data.checkBusy,
                  that.data.listBusy
                );
                console.log(availableIds);
                availableIds.map((i) =>
                  participants.push({
                    name: i.name,
                    url: i.url,
                    id: i.id,
                    time: `${that.unixTimestampToDateString(
                      i.start
                    )} - ${that.unixTimestampToDateString(i.end)}`,
                    checked: false,
                  })
                );
                const conflict = `${that.unixTimestampToDateString(
                  that.data.checkBusy[0].start
                )} - ${that.unixTimestampToDateString(
                  that.data.checkBusy[0].end
                )}`;
                if (availableIds.length > 0) {
                  that.setData({
                    inviteData: that.data.inviteData.filter(
                      (itemA) =>
                        !availableIds.some((itemB) => itemB.id === itemA.id)
                    ),
                    inviteOpenId: that.data.inviteOpenId.filter(
                      (itemA) =>
                        !availableIds.some((itemB) => itemB.id === itemA)
                    ),
                    inviteData2: that.data.inviteData.filter(
                      (itemA) =>
                        !availableIds.some((itemB) => itemB.id === itemA.id)
                    ),
                    participants: that.groupByNameAndUrl(participants),
                    turnPopup: true,
                    turnMode: true,
                    conflict: conflict,
                    disabledAdd: false,
                    disabledInvite: false,
                    hiddenCheck: false,
                  });
                } else {
                  // console.log(that.data.participants);
                  tt.showToast({
                    title: `Hoàn tất kiểm tra`,
                    icon: "success",
                    duration: 1000,
                  });
                  that.setData({
                    disabledAdd: false,
                    disabledInvite: false,
                  });
                }
              }, 3000);
            },
          });
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
              if (that.data.checkChatStatue.length === 0) {
                console.log(1);
                that.setData({
                  chatData,
                });
              } else {
                chatData = chatData.filter(
                  (obj) =>
                    !that.data.checkChatInvite
                      .map((i) => i.name)
                      .includes(obj.name)
                );
                console.log(chatData);
                that.setData({
                  chatData,
                });
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

  // checkConflict(e) {
  //   let that = this;
  //   console.log(e);
  //   let currentValue = e.currentTarget.dataset;
  //   that.setData({
  //     participants: that.data.participants.map((i) => {
  //       if (i.id == currentValue.id && i.checked == false) {
  //         i.checked = !currentValue.checked;
  //       }
  //       if (i.id == currentValue.id && i.checked == true) {
  //         i.checked = !currentValue.checked;
  //       }
  //       return i;
  //     }),
  //   });
  //   // console.log(that.data.participants);
  // },

  checkConflict(e) {
    let that = this;
    console.log(e);
    let currentValue = e.currentTarget.dataset;
    that.setData({
      participants: that.data.participants.map((i) => {
        if (i.id == currentValue.id && i.checked == false) {
          i.checked = !currentValue.checked;
        }
        if (i.id == currentValue.id && i.checked == true) {
          i.checked = !currentValue.checked;
        }
        return i;
      }),
    });
    if (that.data.participants.some((obj) => obj.checked === true)) {
      that.setData({
        disabledCont: false,
      });
    } else {
      that.setData({
        disabledCont: true,
      });
    }

    // console.log(that.data.participants);
  },

  saveInvite() {
    let that = this;
    let inviteData = [...that.data.inviteData];
    let inviteOpenId = [...that.data.inviteOpenId];

    that.data.participants.forEach((itemB) => {
      if (itemB.checked === true) {
        inviteData.push({
          url: itemB.url,
          name: itemB.name,
          id: itemB.id,
        });
        inviteOpenId.push(itemB.id);
      }
    });
    that.setData({
      turnMode: false,
      turnPopup: false,
      inviteData: inviteData,
      inviteData2: inviteData,
      inviteOpenId: inviteOpenId,
      participants: [],

      hiddenCheck: true

    // that.addEventParticipate();

    });
    that.addEventParticipate();

  },

  onShow() {
    let that = this;
    that.listTask()
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
    let ngaylam = that.data.ngaylam;
    let ngaygiobatdau = that.data.ngaygiobatdau;
    let ngaygioketthuc = that.data.ngaygioketthuc;
    let quantrong = that.data.quantrong;
    let ghichu = that.data.ghichu;
    let capbach = that.data.capbach;
    let sogiocanco = that.data.sogiocanco;
    let loai = that.data.loai
    thu=[], theloai=[], recordid=[], ngaylam=[], ngaygiobatdau=[], ngaygioketthuc=[], quantrong=[], ghichu=[], capbach=[], sogiocanco=[], loai=[]
    that.setData({ disabledAdd: true, disabledInvite: true });
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
            "Quan trọng",
            "Cấp bách",
            "Số giờ cần có",
            "Thứ",
            "Ngày - Giờ bắt đầu",
            "Ngày - Giờ kết thúc",
            "Ngày làm",
            "Ghi chú",
            "EventID",
            "CalendarID",
            "Loại"
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
          that.setData({ disabledAdd: false, disabledInvite: false });
          console.log(resp);
          (events = []),
            (eventsID = []),
            (arCalendarId = []),
            resp.data.items.forEach((item) => {
              // Check if "Việc cần làm" exists and has text
              if (
                item.fields?.["Việc cần làm"]?.[0] &&
                item.fields?.["Việc cần làm"]?.[0]?.text
              ) {
                events.push({ name: item.fields?.["Việc cần làm"]?.[0]?.text });
              } else {
                events.push({ name: "" });
              }

              // Extract other fields directly
              eventsID.push(item.fields["EventID"][0].text);
              arCalendarId.push(item.fields["CalendarID"][0].text);
              thu.push(item.fields["Thứ"].value[0].text);
              theloai.push(item.fields["Thể loại"]);
              capbach.push(item.fields["Cấp bách"]);
              quantrong.push(item.fields["Quan trọng"]);
              sogiocanco.push(item.fields?.["Số giờ cần có"]);
              ghichu.push(item.fields["Ghi chú"]?.[0]?.text);
              loai.push(item.fields?.["Loại"]);
              recordid.push(item.record_id);
              ngaylam.push(
                that.convertTimestampToDate(item.fields?.["Ngày làm"])
              );
              ngaygiobatdau.push(
                that.convertTimestampToDate(item.fields["Ngày - Giờ bắt đầu"])
              );
              ngaygioketthuc.push(
                that.convertTimestampToDate(item.fields["Ngày - Giờ kết thúc"])
              );
            });
            let date =[]
          ngaygioketthuc.map(i => {
            if(that.dateTimeToTimestamp(new Date().toISOString().substring(0, 10), "")>that.dateTimeToTimestamp(i,"")){
              date.push("true")
            } else {
              date.push("false")
            } 
          })
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
                quantrong: quantrong[index],
                capbach: capbach[index],
                sogiocanco: sogiocanco[index],
                ghichu: ghichu[index],
                recordid: recordid[index],
                ngaylam: ngaylam[index],
                ngaygiobatdau: ngaygiobatdau[index],
                ngaygioketthuc: ngaygioketthuc[index],
                loai: loai[index],
                date: date[index]
              };
            } else {
              // Return the original event if no corresponding ID is found
              return event;
            }
          });

          events = updatedEvents;
          that.setData({
            eventsID,
            events,
            arCalendarId,
            thu,
            recordid,
            ngaylam,
            ngaygiobatdau,
            ngaygioketthuc,
            quantrong,
            theloai,
            capbach,
            sogiocanco,
            ghichu,
            loai
          });
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
      checkBusy: [],
      disabledAdd: true,
      disabledCheckBox: true,
      hiddenCheck: true
    });
    let currentValue = e.currentTarget.dataset;
    let checkStatue = that.data.checkStatue;
    let checkInvite = that.data.checkInvite;
    let checkId = that.data.checkId;
    let checkChatStatue = that.data.checkChatStatue;
    let checkChatInvite = that.data.checkChatInvite;
    let checkChatId = that.data.checkChatId;
    let checkBusy = that.data.checkBusy;
    checkBusy = [];

      tt.getStorage({
        key: "user_access_token",
        success: (res) => {
          getEvent(
            res.data.access_token,
            currentValue.calendar,
            currentValue.eventid
          ).then((rs) => {
            console.log(rs);
            const diff = that.calculateDaysDifference(
              currentValue.ngaygiobatdau,
              currentValue.ngaygioketthuc
            );
            if (rs.data.event.recurrence !== "") {
              for (let i = 0; i <= diff; i++) {
                checkBusy.push({
                  start: (
                    parseInt(rs.data.event.start_time.timestamp) +
                    i * 86400
                  ).toString(),
                  end: (
                    parseInt(rs.data.event.end_time.timestamp) +
                    i * 86400
                  ).toString(),
                });
              }
              that.setData({
                checkBusy,
                ngaybatdau: currentValue.ngaygiobatdau,
                ngayketthuc: currentValue.ngaygioketthuc,

              });
            } else {
              if (rs.data.event.start_time.timezone === "UTC") {
                const checkBusy = [
                  {
                    start: that.dateTimeToTimestamp(
                      rs.data.event.start_time.date,
                      "00:00:00"
                    ),
                    end: that.dateTimeToTimestamp(
                      rs.data.event.end_time.date,
                      "00:00:00"
                    ),
                  },
                ];
                that.setData({
                  ngaybatdau: currentValue.ngaygiobatdau,
                  ngayketthuc: currentValue.ngaygioketthuc,
                  checkBusy: checkBusy,
                });

              } else {
                checkBusy = [
                  {
                    start: rs.data.event.start_time.timestamp,
                    end: rs.data.event.end_time.timestamp,
                  },
                ];
                that.setData({
                  checkBusy: checkBusy,
                  ngaybatdau: currentValue.ngaygiobatdau,
                  ngayketthuc: currentValue.ngaygioketthuc,
                });
              }

            }
            console.log(that.data.checkBusy);

            that.setData({
              events: that.data.events.map((i) => {
                if (i.value == currentValue.eventid && i.checked == false) {
                  i.checked = !currentValue.checked;
                } else {
                  i.checked = false;
                }
                return i;
              }),
              // disabledCheckBox:false
            });
            console.log(that.data.events.map(i => i.checked));

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
                disabledCheckBox: false,
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
                let data = resp.data.items.filter(
                  (i) => !(i.rsvp_status === "removed")
                );
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
                    checkId = data.map((item) => item.user_id);
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
                      // disabledCheckBox: false
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
                      that.setData({
                        checkInvite,
                        disabledAdd: false,
                        disabledCheckBox: false,
                      });
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
                } else {
                  that.setData({ disabledAdd: false, disabledCheckBox: false });
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
    let events = that.data.events;
    const isIndividual = that.data.selectedInvitePerson === "Cá nhân";
    const idValid = that.data.idCongViec !== "" && that.data.calendarID !== "";
    const inviteValid = isIndividual ? inviteOpenId.length > 0 : idGroup !== "";

    that.setData({hiddenCheck: true})

    const newEvents = events.filter(
      (i) =>
        i.recordid === that.data.getRecord && i.value === that.data.idCongViec
    );
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
          const bodyTask = {
            fields: {
              "Việc cần làm": newEvents[0].name,
              "Thể loại": newEvents[0].theloai,
              "Quan trọng": newEvents[0].quantrong,
              "Cấp bách": newEvents[0].capbach,
              "Số giờ cần có": parseInt(newEvents[0].sogiocanco),
              Person: [
                {
                  id: "",
                },
              ],
              "Ngày - Giờ bắt đầu":
                this.dateTimeToTimestamp(newEvents[0].ngaygiobatdau, "") * 1000,
              "Ngày - Giờ kết thúc":
                this.dateTimeToTimestamp(newEvents[0].ngaygioketthuc, "") *
                1000,
              "Ghi chú": newEvents[0].ghichu,
              "Ngày làm":
                this.dateTimeToTimestamp(newEvents[0].ngaylam, "") * 1000,
              EventID: newEvents[0].value,
              CalendarID: newEvents[0].id,
              // "Số giờ của 1 ngày": Math.abs(
              //   (this.dateTimeToTimestamp(dataDay.date, dataDay.endTime) -
              //     this.dateTimeToTimestamp(dataDay.date, dataDay.startTime)) /
              //   (60 * 60 * 1000)
              // ) * 1000,
              id: newEvents[0].recordid,
              Loại: "shared",
            },
          };
          console.log(bodyTask);
          if (isIndividual) {
            inviteOpenId.forEach((id) => {
              const body = bodyScheduleParticipants("user", id, res);
              createInvitations(body);

              // Create a copy of the body object to avoid modifying the original
              const newBody = { ...bodyTask };
              // Update the "id" field with the current element
              newBody.fields["Person"] = [{ id: id }]; // Assuming Person is an array with one object

              // Call createRecord with the new body object
              createRecord(
                tt.getStorageSync("app_access_token"),
                newBody,
                appVar.GlobalConfig.tableId
              ).then((rs) => {
                tt.showToast({
                  title: "Đã tạo record",
                  icon: "success",
                  duration: 2000,
                });
              });
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
      if (!idValid) {
        return tt.showToast({
          title: "Vui lòng chọn công việc",
          icon: "error",
        });
      }
      if (!inviteValid) {
        return tt.showToast({
          title: "Vui lòng thêm người tham gia",
          icon: "error",
        });
      }
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

  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
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

  convertUTCtoGMT7Timestamp: function (utcString) {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcString);
    // Add the offset to the UTC date to get GMT+7 date
    const gmt7Date = new Date(utcDate.getTime() / 1000);
    // Return the timestamp of the GMT+7 date
    return gmt7Date.getTime();
  },
  unixTimestampToDateString(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    return `${hours}:${minutes}  ${day}/${month}`;
  },

  calculateDaysDifference(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate - startDate;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // Round down to get the exact number of days
    return Math.floor(differenceInDays);
  },
  groupByNameAndUrl(array) {
    const groupedData = {};

    array.forEach((item) => {
      const { name, url, time, checked, id } = item;
      const key = `${name}-${url}`;

      if (!groupedData[key]) {
        groupedData[key] = { name, url, times: [], checked, id };
      }

      groupedData[key].times.push(time);
    });

    return Object.values(groupedData);
  },
});

