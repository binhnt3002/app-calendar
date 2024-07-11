import { bodyCreateTask } from "./detailForm";
import {
  createEvent,
  createRecord,
  getCalendarList,
} from "./function/apiFunction";

Page({
  data: {
    weekOptions: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    selectedWeek: "Thứ 2",
    hours: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    selectedHours: "1",
    importantOptions: ["A", "B", "C"],
    selectedImportant: "A",
    isLoop: false,
    categoryOptions: [
      "Việc chính",
      "Dự án",
      "Việc phát sinh",
      "Việc cần đôn đốc",
      "Đọc & học",
    ],
    dailyData: [{
      "Thứ 2": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Thứ 3": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Thứ 4": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Thứ 5": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Thứ 6": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Thứ 7": {
        date: "", startTime: "", endTime: "", isLoop: false,
      },
      "Chủ nhật": {
        date: "", startTime: "", endTime: "", isLoop: false,
      }
    }],




    selectedCategory: "Việc chính",
    urgentOptions: ["1", "2", "3"],
    selectedurgent: "1",
    // timeOnWeek: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ7"],
    // selectedTimeOnWeek: "Thứ 2",
    selectedDate1: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime1: "Bắt đầu", // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDate2: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime2: "Kết thúc", // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDate3: "",
    calendarID: "",
    eventId: "",
    lich: [],
    chonlich: "",
    dataLich: [],
    inputValue: "",
    inputNote: "",
    inputHours: 0,
    inputHours: 0,
  },
  onSelectedHours: function (e) {
    this.setData({
      selectedHours: this.data.hours[e.detail.value],
    });
  },
  inputTittle: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  inputNote: function (e) {
    this.setData({
      inputNote: e.detail.value,
    });
  },

  inputNeededHours: function (e) {
    this.setData({
      inputHours: parseInt(e.detail.value),
    });
  },

  inputNeededHours: function (e) {
    this.setData({
      inputHours: parseInt(e.detail.value),
    });
  },

  onCalendarChage: function (e) {
    this.setData({
      chonlich: this.data.lich[e.detail.value],
      calendarID: this.data.dataLich.find(
        (item) => item.summary === this.data.lich[e.detail.value]
      ).calendar_id,
    });
  },

  checkboxChange: function (e) {
    this.setData({
      isLoop: !e.detail.value,
    });
    console.log(e.detail.value);

    let data = this.data.dailyData;
    data[0][this.data.selectedWeek].date = this.data.selectedDate3;
    data[0][this.data.selectedWeek].startTime = this.data.selectedTime1;
    data[0][this.data.selectedWeek].endTime = this.data.selectedTime2
    data[0][this.data.selectedWeek].isLoop = !e.detail.value
    this.setData({
      dailyData: data
    })
  },




  onWeekChange: function (e) {
    this.setData({
      selectedWeek: this.data.weekOptions[e.detail.value],
    });
    let data = this.data.dailyData[0][this.data.selectedWeek];

    this.setData({
      selectedDate3: data.date,
      selectedTime1: data.startTime,
      selectedTime2: data.endTime,
      isLoop: data.isLoop
    })
  },

  onCategoryChange: function (e) {
    this.setData({
      selectedCategory: this.data.categoryOptions[e.detail.value],
    });
  },

  onImportantChange: function (e) {
    this.setData({
      selectedImportant: this.data.importantOptions[e.detail.value],
    });
  },

  onCategoryChange: function (e) {
    this.setData({
      selectedCategory: this.data.categoryOptions[e.detail.value],
    });
  },

  onUrgentChange: function (e) {
    this.setData({
      selectedurgent: this.data.urgentOptions[e.detail.value],
    });
  },

  onDateChange1: function (e) {
    this.setData({
      selectedDate1: e.detail.value,
    });
    if (this.data.selectedDate1 > this.data.selectedDate2) {
      this.setData({
        selectedDate2: this.data.selectedDate1,
      });
    }
  },


  onTimeChange1: function (e) {
    this.setData({
      selectedTime1: e.detail.value,
    });
  },

  onDateChange3: function (e) {
    this.setData({
      selectedDate3: e.detail.value,
    });
    let currentDate = new Date(e.detail.value)
    if (currentDate.getDay() === 1) {
      this.setData({
        selectedWeek: "Thứ 2"
      })
    }
    else if (currentDate.getDay() === 2) {
      this.setData({
        selectedWeek: "Thứ 3"
      })
    } else if (currentDate.getDay() === 3) {
      this.setData({
        selectedWeek: "Thứ 4"
      })
    } else if (currentDate.getDay() === 4) {
      this.setData({
        selectedWeek: "Thứ 5"
      })
    } else if (currentDate.getDay() === 5) {
      this.setData({
        selectedWeek: "Thứ 6"
      })
    } else if (currentDate.getDay() === 6) {
      this.setData({
        selectedWeek: "Thứ 7"
      })
    } else {
      this.setData({
        selectedWeek: "Chủ nhật"
      })
    }
  },


  onDateChange2: function (e) {
    this.setData({
      selectedDate2: e.detail.value,
    });
    if (this.data.selectedDate1 > this.data.selectedDate2) {
      this.setData({
        selectedDate2: this.data.selectedDate1,
      });
    }


  },

  onTimeChange2: function (e) {
    this.setData({
      selectedTime2: e.detail.value,
    });
    let data = this.data.dailyData;
    data[0][this.data.selectedWeek].date = this.data.selectedDate3,
      data[0][this.data.selectedWeek].startTime = this.data.selectedTime1,
      data[0][this.data.selectedWeek].endTime = this.data.selectedTime2
    data[0][this.data.selectedWeek].isLoop = this.data.isLoop
    this.setData({
      dailyData: data
    })
  },

  onShow() {
    this.setCalendarData()
  },

  setCalendarData() {
    let that = this;
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        tt.showToast({
          title: "Đang lấy dữ liệu",
          icon: "loading",
        });
        const access_token = res.data.access_token;
        getCalendarList(access_token).then((result) => {
          console.log(result.data.calendar_list);
          that.setData({
            dataLich: result.data.calendar_list,
            lich: result.data.calendar_list.map((item) => item.summary),
          });
        });
      },
    });
  },

  createTask() {
    let that = this;
    tt.showToast({
      title: "Vui lòng chờ...",
      icon: "info",
    });
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        if (
          that.data.inputTittle != "" &&
          that.data.selectedDate1 != "" &&
          that.data.selectedDate2 != "" &&
          that.data.selectedTime1 != "" &&
          that.data.selectedTime2 != ""
        ) {
          //body createEvent (eventTitle, eventDescription, timeStart, timeEnd, visibilityType)
          const body = bodyCreateTask(
            that.data.inputValue,
            that.data.inputNote,
            this.dateTimeToTimestamp(
              that.data.selectedDate1,
              that.data.selectedTime1
            ).toString(),
            this.dateTimeToTimestamp(
              that.data.selectedDate2,
              that.data.selectedTime2
            ).toString(),
            this.dateTimeToTimestamp(
              that.data.selectedDate1,
              that.data.selectedTime1
            ).toString(),
            this.dateTimeToTimestamp(
              that.data.selectedDate2,
              that.data.selectedTime2
            ).toString(),
            "default"
          );
          createEvent(res.data.access_token, that.data.calendarID, body).then(
            (rs) => {
              console.log(rs);

              that.setData({ eventId: rs.data.event.event_id });

              const body2 = {
                fields: {
                  "Việc cần làm": that.data.inputValue,
                  "Thể loại": that.data.selectedCategory,
                  "Quan trọng": that.data.selectedImportant,
                  "Cấp bách": that.data.selectedurgent,
                  "Số giờ cần có": that.data.inputHours,
                  Person: [
                    {
                      id: res.data.open_id,
                    },
                  ],
                  "Ngày - Giờ bắt đầu":
                    this.dateTimeToTimestamp(
                      that.data.selectedDate1,
                      that.data.selectedTime1
                    ) * 1000,
                  "Ngày - Giờ kết thúc":
                    this.dateTimeToTimestamp(
                      that.data.selectedDate1,
                      that.data.selectedTime1
                    ) * 1000,
                  "Ghi chú": that.data.inputNote,
                  EventID: that.data.eventId,
                  CalendarID: that.data.calendarID,
                },
              };
              console.log(body2);
              createRecord(res.data.access_token, body2).then((rs) => {
                console.log(rs);
              });

              tt.showToast({
                title: "Tạo xong công việc",
                icon: "success",
              });
            }
          );


        } else {
          tt.showToast({
            title: "Vui lòng nhập đầy đủ dữ liệu",
            icon: "error",
          });
        }
      },
    });
  },

  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },
});
