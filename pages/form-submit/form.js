import { bodyCreateTask } from "./detailForm";
import {
  createEvent,
  createRecord,
  getCalendarList,
} from "./function/apiFunction";

Page({
  data: {
    weekOptions: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    selectedWeek: "Tuần 1",
    importantOptions: ["A", "B", "C"],
    selectedImportant: "A",
    categoryOptions: [
      "Việc Chính",
      "Dự án",
      "Việc phát sinh",
      "Việc cần đôn đốc",
      "Đọc & học",
    ],
    selectedCategory: "Việc Chính",
    urgentOptions: ["1", "2", "3"],
    selectedurgent: "1",
    selectedDate1: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime1: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDate2: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime2: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    calendarID: "",
    lich: [],
    chonlich: "",
    dataLich: [],
    inputValue: "",
    inputNote: "",
    inputHours: 0,
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

  onCalendarChage: function (e) {
    this.setData({
      chonlich: this.data.lich[e.detail.value],
      calendarID: this.data.dataLich.find(
        (item) => item.summary === this.data.lich[e.detail.value]
      ).calendar_id,
    });
  },

  onWeekChange: function (e) {
    this.setData({
      selectedWeek: this.data.weekOptions[e.detail.value],
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
  },

  onShow() {
    this.setCalendarData();
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
    console.log(that.data.inputValue);
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        if (
          that.data.inputValue != "" &&
          that.data.selectedDate1 != "" &&
          that.data.selectedTime1 != "" &&
          that.data.selectedDate2 != "" &&
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
            "default"
          );
          createEvent(res.data.access_token, that.data.calendarID, body).then(
            (rs) => {
              console.log(rs);

              tt.showToast({
                title: "Tạo xong",
                icon: "success",
              });
            }
          );
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
              CalendarID: that.data.calendarID,
            },
          };
          console.log(body2);
          createRecord(res.data.access_token, body2).then((rs) => {
            console.log(rs);
          });
        } else {
          tt.showToast({
            title: "Thiếu dữ liệu tên hoặc loại lịch",
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
