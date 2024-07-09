import { sendRequest } from "../../utils/sendRequest";
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
      "Việc chính",
      "Dự án",
      "Việc phát sinh",
      "Việc cần đôn đốc",
      "Đọc & học",
    ],
    selectedCategory: "Việc chính",
    urgentOptions: ["1", "2", "3"],
    selectedurgent: "1",
    selectedDate1: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime1: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDate2: "", // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime2: "", // Thêm selectedTime để lưu ngày và giờ được chọn
    calendarID: "",
    eventId: "",
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
  onLoad() {
    this.getRecordDetail();
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

  getRecordDetail() {
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        const url =
          "https://open.larksuite.com/open-apis/bitable/v1/apps/FeaubtGlja6dtds66P7l6iYbgwd/tables/tblPjWdyJh5OdMZe/records/search";
        const headers = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };
        const body = {
          field_names: [
            "Việc cần làm",
            "Thể loại",
            "Quan trọng",
            "Cấp bách",
            "Số giờ cần có",
          ],
          filter: {
            conjunction: "and",
            conditions: [
              {
                field_name: "Person",
                operator: "is",
                value: [res.data.open_id],
              },
              {
                field_name: "Việc cần làm",
                operator: "is",
                value: ["dự án mới 2"],
              },
            ],
          },
          automatic_fields: false,
        };

        sendRequest(url, "POST", headers, body).then((result) => {
          console.log(result);

          this.setData({
            inputValue: result.data.items[0].fields["Việc cần làm"][0].text,
            inputHours: result.data.items[0].fields["Số giờ cần có"],
          });
        });
      },
    });
  },

  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },
});
