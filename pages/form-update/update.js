import { searchRecord, getCalendar } from "../form-submit/function/apiFunction";
import {
  updateRecord,
  deleteRecord,
  deleteEvent,
} from "./function/apiFunction";
import { bodyUpdateEvent } from "./detailForm";
import { sendRequest } from "../../utils/sendRequest";
Page({
  data: {
    tableData: [],
    vieccanlam: [],
    theloai: [],
    quantrong: [],
    capbach: [],
    thu: [],
    ghichu: [],
    ngaygiobatdau: [],
    ngaygioketthuc: [],
    eventid: [],
    calendarid: [],
    edit: [],
    ngaylam: [],
    sogiocanco: [],
    turnPopup: false,
    calendarname: "",
    hours: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    selectedDayWork: "",
    mindate: new Date(),
    startDate: new Date().toISOString().substring(0, 10),
    endDate: "",
    selectedHours: "",
    recordId: [],
    dataRemoveAll: [],
    dataRemove: [],
    endTime: "",
    startTime: "",
    inputNote: "",
    inputValue: "",
  },
  inputNote: function (e) {
    this.setData({
      inputNote: e.detail.value,
    });
  },

  inputTittle: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  onSelectedHours: function (e) {
    this.setData({
      selectedHours: this.data.hours[e.detail.value],
    });
  },

  onTimeChange1: function (e) {
    this.setData({
      startTime: e.detail.value,
    });

    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
  },

  onTimeChange2: function (e) {
    this.setData({
      endTime: e.detail.value,
    });
    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
  },

  onDateChange1: function (e) {
    this.setData({
      startDate: e.detail.value,
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
        selectedDayWork: this.data.startDate,
      });
    }

    console.log(this.data.startDate);
  },

  onDateChange2: function (e) {
    this.setData({
      endDate: e.detail.value,
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
      });
    }
  },

  onDateChange3: function (e) {
    this.setData({
      selectedDayWork: e.detail.value,
    });

    let now = new Date(e.detail.value);
    let dayOfWeek = now.getDay();

    let dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    let dayKey = dayNames[dayOfWeek];

    let data = this.data.dailyData[0][dayKey];
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime,
      isLoop: data.isLoop,
    });

    this.setData({
      selectedDay: dayKey,
    });
  },

  onShow() {
    let that = this;
    that.listTask();
  },
  listTask() {
    let that = this;
    let vieccanlam = that.data.vieccanlam;
    let theloai = that.data.theloai;
    let quantrong = that.data.quantrong;
    let capbach = that.data.capbach;
    let thu = that.data.thu;
    let ghichu = that.data.ghichu;
    let ngaygiobatdau = that.data.ngaygiobatdau;
    let ngaygioketthuc = that.data.ngaygioketthuc;
    let eventid = that.data.eventid;
    let calendarid = that.data.calendarid;
    let tableData = that.data.tableData;
    let ngaylam = that.data.ngaylam;
    let sogiocanco = that.data.sogiocanco;
    let recordId = that.data.recordId;
    let dataRemoveAll = that.data.dataRemoveAll;
    let dataRemove = that.data.dataRemove;
    dataRemove = [];
    dataRemoveAll = [];
    vieccanlam = [];
    theloai = [];
    capbach = [];
    quantrong = [];
    thu = [];
    ngaygiobatdau = [];
    ngaygioketthuc = [];
    ghichu = [];
    eventid = [];
    calendarid = [];
    ngaylam = [];
    tableData = [];
    sogiocanco = [];
    recordId = [];
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
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
          ],
          "sort": [
            {
                "field_name": "Thể loại",
                "asc": true
            },
            {
              "field_name": "Việc cần làm",
              "asc": true
            }
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
        searchRecord(access_token, body).then((result) => {
          console.log(result);
          result.data.items.map((item) => {
            vieccanlam.push({
              vieccanlam: item.fields["Việc cần làm"][0].text,
            }),
              theloai.push({ theloai: item.fields["Thể loại"] }),
              quantrong.push({ quantrong: item.fields["Quan trọng"] }),
              capbach.push({ capbach: item.fields["Cấp bách"] }),
              thu.push({ thu: item.fields["Thứ"].value[0].text });
            ngaygiobatdau.push({
              ngaygiobatdau: that.convertTimestampToDate(
                item.fields["Ngày - Giờ bắt đầu"]
              ),
            }),
              ngaygioketthuc.push({
                ngaygioketthuc: that.convertTimestampToDate(
                  item.fields["Ngày - Giờ kết thúc"]
                ),
              }),
              ghichu.push({ ghichu: item.fields["Ghi chú"][0].text }),
              eventid.push({ eventid: item.fields["EventID"][0].text }),
              calendarid.push({
                calendarid: item.fields["CalendarID"][0].text,
              });
            ngaylam.push({
              ngaylam: that.convertTimestampToDate(item.fields["Ngày làm"]),
            });
            sogiocanco.push({ sogiocanco: item.fields["Số giờ cần có"] });
            recordId.push({ recordId: item.record_id });
            tableData = vieccanlam.map((item, index) => {
              return {
                ...item,
                ...theloai[index],
                ...quantrong[index],
                ...capbach[index],
                ...thu[index],
                ...ngaygiobatdau[index],
                ...ngaygioketthuc[index],
                ...ngaylam[index],
                ...ghichu[index],
                ...eventid[index],
                ...calendarid[index],
                ...sogiocanco[index],
                ...recordId[index],
              };
            });
            that.setData({
              capbach,
              quantrong,
              theloai,
              ngaygiobatdau,
              ngaygioketthuc,
              ghichu,
              vieccanlam,
              tableData,
              thu,
              eventid,
              calendarid,
              ngaylam,
              sogiocanco,
              recordId,
            });
          });
        });
      },
    });
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

  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },

  edit(e) {
    let that = this;
    let edit = that.data.edit;
    console.log(e);
    const currentTarget = e.currentTarget.id;
    edit = that.data.tableData.find((obj) => obj.eventid === currentTarget);
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        getCalendar(res.data.access_token, edit.calendarid).then((rs) => {
          that.setData({ calendarname: rs.data.summary });
        });
      },
    });
    that.setData({
      turnPopup: true,
      edit,
      selectedHours: edit.sogiocanco,
      inputNote: edit.ghichu,
      inputValue: edit.vieccanlam,
    });
    console.log(that.data.edit);
  },

  update() {
    let that = this;
    that.setData({ turnPopup: false });
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const user_access_token = res.data.access_token;
        let dataForCalendarUpdate = bodyUpdateEvent(
          that.data.inputValue,
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.startTime),
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.endTime),
          that.data.inputNote
        );

        // console.log(body);
        // updateEvent(res.data.access_token, that.data.edit.calendarid, that.data.eventid,body).then ((rs)=>{
        //   console.log(rs);
        // })

        const url =
          "https://script.google.com/macros/s/AKfycbxhfDmKiziX7qCouyECEUH2djZnFU9HcybnpgXhT7NJ6f2hXr-mbjUZ6YDwuXdTa967/exec";
        const header = {
          "Content-Type": "application/json",
        };

        console.log(that.data.tableData);

        const body = {
          action: "updateCalendarOrEvent",
          url: `https://open.larksuite.com/open-apis/calendar/v4/calendars/${that.data.edit.calendarid}/events/${that.data.edit.eventid}`,
          user_access_token: user_access_token,
          body: {
            ...dataForCalendarUpdate,
          },
        };

        console.log(body);
        let findRecordId = that.data.tableData.find(
          (obj) => obj.vieccanlam === that.data.edit.vieccanlam
        ).recordId;
        console.log(findRecordId);

        let dataForRecordUpdate = {
          records: [
            {
              record_id: that.data.edit.recordId,
              fields: {
                "Việc cần làm": that.data.inputValue,
                "Ghi chú": that.data.inputNote,
              },
            },
          ],
        };
        console.log(dataForRecordUpdate);
        let toastId = tt.showToast({
          title: "Đang cập nhật",
          icon: "loading",
          duration: 10000, // Set duration to 0 to make the toast stay indefinitely
        });
        sendRequest(url, "POST", header, body)
          .then((rs) => {
            console.log(rs);
            updateRecord(user_access_token, dataForRecordUpdate)
              .then((rs) => {
                console.log(rs);
                that.listTask();
                tt.hideToast({
                  toastId: toastId, // Use the toastId from the initial showToast call to hide it
                });
                // After all operations are done, show the success toast
                tt.showToast({
                  title: "Cập nhật công việc thành công",
                  icon: "success",
                  duration: 3000, // Show the success message for 3 seconds
                });
              })
              .catch((error) => {
                console.error("Update failed:", error);
                tt.hideToast({
                  toastId: toastId, // Ensure the loading toast is hidden even if there's an error
                });
                // Optionally, show an error toast to the user
                tt.showToast({
                  title: "Cập nhật thất bại",
                  icon: "fail",
                  duration: 3000,
                });
              });
          })
          .catch((error) => {
            console.error("Request failed:", error);
            tt.hideToast({
              toastId: toastId, // Ensure the loading toast is hidden even if the request fails
            });
            // Optionally, show an error toast to the user
            tt.showToast({
              title: "Gửi yêu cầu thất bại",
              icon: "fail",
              duration: 3000,
            });
          });
      },
    });
  },

  confirmUpdate(e) {
    const eventId = e.currentTarget.id;
    const that = this;

    tt.showModal({
      title: "Xác nhận cập nhật công việc",
      content: "Bạn có muốn cập nhật công việc này?",
      confirmText: "Cập nhật",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.update();
        } else if (res.cancel) {
          console.log("User canceled update");
        }
      },
      fail(res) {
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  deleteItem(e) {
    let that = this;
    let index = e.id
    let dataset = e.dataset.id
    let dataRemoveAll = that.data.dataRemoveAll
    let dataRemove = that.data.dataRemove
    dataRemove = []
    const newTabbleData = [...that.data.tableData]
    
    //dữ liệu sau khi bị xóa
    const dataAfterRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid !== index;
    });
    //dữ liệu từng phần tử bị xóa - cộng dồn
    const tempRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid === index;
    });

    tempRemove.map(i => dataRemove.push({"recordid": i.recordId, "calendarid": i.calendarid}))
    //toàn bộ dữ liệu (có trùng) để xóa - cộng dồn
    const tempRemoveAll = newTabbleData.filter(function (phanTu) {
      return phanTu.vieccanlam === dataset;
    });
    tempRemoveAll.map((i) => dataRemoveAll.push(i.recordId));

    console.log(dataRemove);
    console.log(dataRemoveAll);
    console.log(dataAfterRemove);
    that.setData({
      tableData: dataAfterRemove,
      dataRemoveAll,
      dataRemove
    })

    // xóa record
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const body = {
          "records": [
            e.dataset.record
          ]
        }
        deleteEvent(res.data.access_token,that.data.dataRemove[0].calendarid,index).then((result) => {
          console.log(result);
        });
        deleteRecord(res.data.access_token, body).then((rs) => {
          console.log(rs);
        });

        const client = new lark.Client({
          appId: "cli_a6f1c211d239d010",
          appSecret: "Xo29OAjgiiE5ANYCIWRR5etAwqGP08dN",
        });

        client.bitable.appTableRecord.delete(
          {},
          lark.withUserAccessToken(res.data.access_token).then((res) => {
            console.log(res);
          })
        );
      },
    });
  },

  confirmDelete(e) {
    const eventId = e.currentTarget;
    console.log(e);
    const that = this;

    tt.showModal({
      title: "Xác nhận xóa công việc",
      content: "Bạn có muốn xóa công việc này ?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.deleteItem(eventId);
        } else if (res.cancel) {
          console.log("User canceled deletion");
        }
      },
      fail(res) {
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  exit() {
    this.setData({ turnPopup: false });
  },
});
