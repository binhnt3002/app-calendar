import { searchRecord, getCalendar } from "../form-submit/function/apiFunction";
import { updateEvent, updateRecord } from "./function/apiFunction";
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

    // let now = new Date(e.detail.value)

    // let data = this.data.dailyData[0]["Thứ " + ((now.getDay() + 6) % 7 + 1)];
    // this.setData({
    //   startTime: data.startTime,
    //   endTime: data.endTime,
    //   isLoop: data.isLoop
    // })

    // let currentDate = new Date(e.detail.value);
    // if (currentDate.getDay() === 1) {
    //   this.setData({
    //     selectedDay: "Thứ 2",
    //   });
    // } else if (currentDate.getDay() === 2) {
    //   this.setData({
    //     selectedDay: "Thứ 3",
    //   });
    // } else if (currentDate.getDay() === 3) {
    //   this.setData({
    //     selectedDay: "Thứ 4",
    //   });
    // } else if (currentDate.getDay() === 4) {
    //   this.setData({
    //     selectedDay: "Thứ 5",
    //   });
    // } else if (currentDate.getDay() === 5) {
    //   this.setData({
    //     selectedDay: "Thứ 6",
    //   });
    // } else if (currentDate.getDay() === 6) {
    //   this.setData({
    //     selectedDay: "Thứ 7",
    //   });
    // }
    // else if (currentDate.getDay() === 0) {
    //   this.setData({
    //     selectedDay: "Chủ nhật",
    //   });
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
          that.data.inputTittle,
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
          url: `https://open.larksuite.com/open-apis/calendar/v4/calendars/${that.data.tableData.calendarid}/events/${that.data.tableData.eventid}`,
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
              record_id: findRecordId,
              fields: {
                "Việc cần làm": that.data.inputValue,
                "Ghi chú": that.data.inputNote,
              },
            },
          ],
        };

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
});
