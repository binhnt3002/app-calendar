import { bodyCreateTask, bodyCreateRecord } from "./detailForm";
import {
  createEvent,
  createRecord,
  getCalendarList,
} from "../function/apiFunction";

const appVar = getApp();

dayOptions2 = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
],

Page({
  data: {
    selectedDay: dayOptions2[new Date().getDay()],
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
    
    dailyData: [
      { 
        "Thứ 2": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Thứ 3": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Thứ 4": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Thứ 5": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Thứ 6": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Thứ 7": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
        "Chủ nhật": { date: "", startTime: "", endTime: "", inputNote: "", isLoop: false,},
      },
    ],

    selectedCategory: "Việc chính",
    urgentOptions: ["1", "2", "3"],
    selectedurgent: "1",

    mindate: new Date(),
    startDate: new Date().toISOString().substring(0, 10), // Thêm selectedDate để lưu ngày và giờ được chọn
    endDate: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    startTime: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    endTime: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDayWork: new Date().toISOString().substring(0, 10),

    calendarID: "",
    eventId: "",
    lich: [],
    chonlich: "",
    dataLich: [],

    inputValue: "",
    inputNote: "",

    tableName: [],

    isSHow: false,
    iSo: true,
    
    diabledBtn: false,
    disableDayWork: true,

    dailyLoop : false,
  },

  inputHours: function (e) {
    if (e.detail.value > 36 || e.detail.value < 0) {
      return tt.showModal({
        title: "Thông báo",
        content: "Tổng thời gian công việc phải ở khoảng 0.5h - 36h.",
        confirmText: "Đóng",
        showCancel: false,
      });
    }
    this.setData({
      selectedHours: e.detail.value,
    });    
  },

  onSelectedHours: function (e) {
    if (this.data.hours[e.detail.value] == "Khác") {      
      this.setData({
        isSHow: true,
        iSo: false,
      });      
      return;
    }
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
    let data = this.data.dailyData;
    data[0][this.data.selectedDay].inputNote = this.data.inputNote;
    this.setData({
      dailyData: data,
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

  dailyLoopCheckBoxChange: function (e) {
    
    if (!e.currentTarget.dataset.check) {
      this.setData({
        dailyLoop:  !e.currentTarget.dataset.check,
        weekLoop : true,
        isLoop:false,
      });
    }else{
      this.setData({
        dailyLoop:  !e.currentTarget.dataset.check,
        weekLoop : false,
        isLoop: false,
      });
    }
    
  },

  checkboxChange: function (e) {

    const selectedDay = this.data.selectedDay;
    const selectedDayWork = this.data.selectedDayWork;
    const startTime = this.data.startTime;
    const endTime = this.data.endTime;
    const inputNote = this.data.inputNote;

    const dailyData = this.data.dailyData;
    const isLoop = !e.currentTarget.dataset.checked;

    

    dailyData[0][selectedDay] = {
      date: selectedDayWork,
      startTime,
      endTime,
      inputNote,
      isLoop,
    };

    if (!e.currentTarget.dataset.checked) {
      this.setData({
        dailyLoop : false,
        dailyCheckBox : true,
        isLoop,
        dailyData,
      })
    }else{
      this.setData({
        dailyLoop : false,
        dailyCheckBox : false,
        isLoop,
        dailyData,
      })
    }
  },

  onWeekChange: function (e) {
    this.setData({
      selectedDay: this.data.dayOptions[e.detail.value],
    });
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
      startDate: e.detail.value,
      disableEndDate: false,
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
        selectedDayWork: this.data.startDate,
      });
    }
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

  onDateChange3: function (e) {
    
    
    
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
      inputNote: data.inputNote,
    });

   

    this.setData({
      selectedDayWork: e.detail.value,
      selectedDay: dayKey,
    });
  },

  onDateChange2: function (e) {
    this.setData({
      endDate: e.detail.value,
      disableDayWork: false,  
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
      });
    }
  },

  onTimeChange2: function (e) {
    this.setData({
      endTime: e.detail.value,
    });
    let data = this.data.dailyData;
    data[0][this.data.selectedDay].date = this.data.selectedDayWork;
    data[0][this.data.selectedDay].startTime = this.data.startTime;
    data[0][this.data.selectedDay].endTime = this.data.endTime;
    data[0][this.data.selectedDay].inputNote = this.data.inputNote;
    data[0][this.data.selectedDay].isLoop = this.data.isLoop;

    this.setData({
      dailyData: data,
    });

    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
    this.calculateTime();
  },

  onShow() {
    let that = this;
    this.auth = setInterval(() => {
      let isComplete = tt.getStorageSync("isComplete");
      tt.showToast({
        title: "Đang lấy dữ liệu",
        icon: "loading",
        duration: 5000,
      });
      if (isComplete) {
        clearInterval(this.auth);
        setTimeout(() => that.setCalendarData(), 3000);
      }
    }, 1000);
    
  },

  setCalendarData() {
    let that = this;
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        getCalendarList(access_token).then((result) => {
          console.log(result.data);
          that.setData({
            dataLich: result.data.calendar_list,
            lich: result.data.calendar_list.map((item) => item.summary),
            // tableName: rs.data.items.filter(item => item.name.includes("Bảng Phân Công")).map(item => ({name: item.name, table: item.table_id})),
          });
        });
        tt.showToast({
          title: "lấy dữ liệu thành công",
          icon: "success",
        });
      },
    });
  },

  calculateTime() {
    let totalHours = 0;
    this.data.dailyData.forEach((item) => {
      if (item[this.data.selectedDay]) {
        totalHours +=
          parseInt(item[this.data.selectedDay].endTime.split(":")[0]) -
          parseInt(item[this.data.selectedDay].startTime.split(":")[0]);
      }
    });
    this.setData({totalHours})
    return totalHours;
  },


  createTask() {
    let that = this;
    if (that.calculateTime() > parseInt(that.data.selectedHours)) {
      return tt.showModal({
        title: "Thông báo",
        content: "Đã vượt quá giờ cho phép. Vui lòng chọn lại.",
        confirmText: "Đóng",
        showCancel: false,
      })
    }
    
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        if (
          that.data.CalendarID != "" &&
          that.data.inputValue != "" &&
          that.data.startDate != "" &&
          that.data.endDate != "" &&
          that.data.startTime != "" &&
          that.data.endTime != ""
        ) {

          tt.showToast({
            title: "Đang tạo",
            icon: "loading",
            duration: 5000,
            success: () => {              
              that.setData({
                diabledBtn: true
              })
            }
          })


          //tạo và lặp lại mỗi ngày
          if (that.data.dailyLoop == true) {

            for (const dayName in that.data.dailyData[0]) {
              const dataDay = that.data.dailyData[0][dayName];
              if (
                dataDay.date === "" ||
                dataDay.startTime === "" ||
                dataDay.endTime === ""
              ) {
                continue;
              }
              const body = bodyCreateTask(
                that.data.inputValue,
                dataDay.inputNote,
                this.dateTimeToTimestamp(
                  dataDay.date,
                  dataDay.startTime
                ).toString(),
                this.dateTimeToTimestamp(
                  dataDay.date,
                  dataDay.endTime
                ).toString(),
                that.formatDateToUTC(that.data.endDate,""),
                false,
                that.data.dailyLoop
              );
            console.log(body);

            createEvent(access_token, that.data.calendarID, body).then(result => {
              console.log(result);
              const body2 = {
                fields: {
                  "Việc cần làm": that.data.inputValue,
                  "Thể loại": that.data.selectedCategory,
                  "Quan trọng": that.data.selectedImportant,
                  "Cấp bách": that.data.selectedurgent,
                  "Số giờ cần có": Number.parseInt(that.data.selectedHours),
                  "Person": [
                    {
                      id: res.data.open_id,
                    },
                  ],
                  "Ngày - Giờ bắt đầu":
                    this.dateTimeToTimestamp(that.data.startDate, "") * 1000,
                  "Ngày - Giờ kết thúc":
                    this.dateTimeToTimestamp(that.data.endDate, "") * 1000,
                  "Ghi chú": dataDay.inputNote,
                  "Ngày làm":
                    this.dateTimeToTimestamp(dataDay.date, "") * 1000 ,
                  EventID: result.data.event.event_id,
                  CalendarID: that.data.calendarID,
                  "Số giờ của 1 ngày": Math.abs(
                    (this.dateTimeToTimestamp(dataDay.date, dataDay.endTime) -
                      this.dateTimeToTimestamp(dataDay.date, dataDay.startTime)) /
                      (60 * 60 * 1000)
                  ) * 1000,

                  "id" : (Math.round(this.getRandomArbitrary(1000, 9999))).toString()

                },
              };
              console.log(body2);
              createRecord(tt.getStorageSync("app_access_token"), body2, appVar.GlobalConfig.tableId).then(
                rs => {
                  console.log(rs);
                  that.setData({
                    diabledBtn: false
                  })
                  tt.showToast({
                    title: "Đã tạo",
                    icon: "success",
                    duration: 2000,
                  });
                }
              )
              this.setData({
                inputValue: "",
                inputNote: "",
                selectedCategory: "Việc chính",
                selectedurgent: "1",
                selectedImportant: "A",
                selectedHours: "1",
                startDate: "Chọn ngày",
                endDate: "",
                startTime: "",
                endTime: "",
                dailyLoop: false,
                weekLoop: false,
              });
            })
            }
            return;
          }


          //tạo task theo ngay
          for (const dayName in that.data.dailyData[0]) {
            const dataDay = that.data.dailyData[0][dayName];

            if (
              dataDay.date === "" ||
              dataDay.startTime === "" ||
              dataDay.endTime === ""
            ) {
              continue;
            }

            const body = bodyCreateTask(
              that.data.inputValue,
              dataDay.inputNote,
              this.dateTimeToTimestamp(
                dataDay.date,
                dataDay.startTime
              ).toString(),
              this.dateTimeToTimestamp(
                dataDay.date,
                dataDay.endTime
              ).toString(),
              that.formatDateToUTC(that.data.endDate,1),
              dataDay.isLoop
            );
            console.log(body);

            createEvent(access_token, that.data.calendarID, body).then(
              (rs) => {
                console.log(rs);
                const body2 = {
                  fields: {
                    "Việc cần làm": that.data.inputValue,
                    "Thể loại": that.data.selectedCategory,
                    "Quan trọng": that.data.selectedImportant,
                    "Cấp bách": that.data.selectedurgent,
                    "Số giờ cần có": Number.parseInt(that.data.selectedHours),
                    "Person": [
                      {
                        id: res.data.open_id,
                      },
                    ],
                    "Ngày - Giờ bắt đầu":
                      this.dateTimeToTimestamp(that.data.startDate, "") * 1000,
                    "Ngày - Giờ kết thúc":
                      this.dateTimeToTimestamp(that.data.endDate, "") * 1000,
                    "Ghi chú": dataDay.inputNote,
                    "Ngày làm":
                      this.dateTimeToTimestamp(dataDay.date, "") * 1000 ,
                    EventID: rs.data.event.event_id,
                    CalendarID: that.data.calendarID,
                    "Số giờ của 1 ngày": Math.abs(
                      (this.dateTimeToTimestamp(dataDay.date, dataDay.endTime) -
                        this.dateTimeToTimestamp(dataDay.date, dataDay.startTime)) /
                        (60 * 60 * 1000)
                    ) * 1000,

                    "id" : (Math.round(this.getRandomArbitrary(1000, 9999))).toString()

                  },
                };
                console.log(body2);
                createRecord(tt.getStorageSync("app_access_token"), body2,appVar.GlobalConfig.tableId).then((rs) => {
                  console.log(rs);
                  tt.showToast({
                    title: "Tạo xong công việc",
                    icon: "success",
                    success: () => {
                      console.log("mở khóa");
                      
                      that.setData({
                        diabledBtn: false
                      })
                    }
                  });
                  this.setData({
                    inputValue: "",
                    inputNote: "",
                    selectedCategory: "Việc chính",
                    selectedurgent: "1",
                    selectedImportant: "A",
                    selectedHours: "1",
                    startDate: "Chọn ngày",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    isLoop: false,
                  });
                });
              }
            );
          }
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

  formatDateToUTC(dateString,days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    const newDate = date.toISOString().split('T')[0]
    return newDate.replace(/-/g, "") + "T000000Z";
  },

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
});
