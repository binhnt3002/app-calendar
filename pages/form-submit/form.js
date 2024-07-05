import { bodyCreateTask, bodyCreateRecord } from './detailForm';
import { createEvent, getCalendarList, createRecord } from './function/apiFunction';

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
    canvasId: "chartId", // canvasId unique chart Id
    eventId:'',
    styles: `
      height: 50vh;
      width: 100%
    `, // style string
    // Chart configuration options
    spec: {
      type: "pie",
      data: [
        {
          id: "data1",
          values: [
            { value: 335, name: "Direct Access" },
            { value: 310, name: "Email Marketing" },
            { value: 274, name: "Affiliate Advertising" },
            { value: 123, name: "Search Engine" },
            { value: 215, name: "Video Advertising" },
          ],
        },
      ],
      outerRadius: 0.6,
      categoryField: "name",
      valueField: "value",
    },
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
  },

  // onDateChange1: function (e) {
  //   const selectedDate = e.detail.value; // Get selected date in YYYY-MM-DD format

  //   // Get selected time from another input field or event (e.g., time picker)
  //   const timePicker = document.getElementById('timePicker'); // Replace with your time picker's ID

  //   timePicker.addEventListener('timeChange', (event) => {
  //     const selectedTime = event.detail.selectedTime; // Replace with the property name containing the selected time
  //   });

  //   const dateTime = new Date(`${selectedDate} ${timePicker}`);

  //   this.setData({
  //     selectedDate1: dateTime.toISOString() // Store combined date and time in ISO format
  //   });
  // },

  onTimeChange1: function (e) {
    this.setData({
      selectedTime1: e.detail.value,
    });
  },

  onDateChange2: function (e) {
    this.setData({
      selectedDate2: e.detail.value,
    });
  },

  onTimeChange2: function (e) {
    this.setData({
      selectedTime2: e.detail.value,
    });
  },

  onReady() {
    this.setCalendarData();
    this.getUserInfo();
  },
  getUserInfo() {
    let that = this;
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        that.setData({ userInfo: res.data });
      },
    });
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
      }
    })
  },

  createTask() {
    let that = this;
    let startTime = that.dateTimeToTimestamp(that.data.selectedDate1,that.data.selectedTime1);
    let endTime = that.dateTimeToTimestamp(that.data.selectedDate2,that.data.selectedTime2);
    let input = that.data.inputValue;
    let inputNote = that.data.inputNote;
    tt.showToast({
      title: 'Vui lòng chờ...',
      icon: 'load',
    });
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        if (input != '' && that.data.calendarID != '' && that.data.selectedDate1 !='' && that.data.selectedDate2 !='' && that.data.selectedTime1!='' && that.data.selectedTime2 !='') {
          //body createEvent (eventTitle, eventDescription, timeStart, timeEnd, visibilityType)
          const body = bodyCreateTask(input, inputNote, startTime, endTime, 'default');
          createEvent(res.data.access_token, that.data.calendarID, body).then((rs) => {
            console.log(rs);
            that.setData({eventId: rs.data.event.event_id});
            console.log(that.data.eventId);
            tt.showToast({
              title: 'Task Calendar',
              icon: 'success',
            });
            const body2 = bodyCreateRecord(input,that.data.selectedCategory,that.data.selectedImportant, that.data.selectedurgent,5,res.data.open_id,startTime,endTime,inputNote,that.data.eventId);
            createRecord(res.data.access_token,body2).then((rs) =>{
              console.log(rs);
              tt.showToast({
                title: 'Đã lưu dữ liệu',
                icon: 'success',
              });
            });
          })
        } else {
          tt.showToast({
            title: 'Vui lòng nhập đầy đủ dữ liệu',
            icon: 'error',
          });
        }
      }
    })
  },


  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },
});
