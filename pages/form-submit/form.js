import {getCalendarList} from './function/apiFunction';

Page({
  data: {
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
    importantOptions: ['A', 'B', 'C'],
    selectedImportant: 'A',
    categoryOptions: ['Việc Chính', 'Dự án', 'Việc phát sinh', 'Việc cần đôn đốc', 'Đọc & học'],
    selectedCategory: 'Việc Chính',
    urgentOptions: ['1', '2', '3'],
    selectedurgent: '1',
    selectedDate1: '', // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime1: '', // Thêm selectedTime để lưu ngày và giờ được chọn
    selectedDate2: '', // Thêm selectedDate để lưu ngày và giờ được chọn
    selectedTime2: '', // Thêm selectedTime để lưu ngày và giờ được chọn
    userInfo: {},
    calendarID: "",
    lich: [],
    chonlich:"",
    dataLich: []
  },

  onCalendarChage(e) {
    this.setData({
      chonlich: this.data.lich[e.detail.value],
      calendarID: that.data.dataLich.find(item => item.summary === this.data.chonlich).calendar_id
    });
  },

  onWeekChange: function (e) {
    this.setData({
      selectedWeek: this.data.weekOptions[e.detail.value]
    });
  },

  onImportantChange: function (e) {
    this.setData({
      selectedImportant: this.data.importantOptions[e.detail.value]
    });
  },


  onCategoryChange: function (e) {
    this.setData({
      selectedCategory: this.data.categoryOptions[e.detail.value]
    });
  },

  onUrgentChange: function (e) {
    this.setData({
      selectedurgent: this.data.urgentOptions[e.detail.value]
    });
  },

  onDateChange1: function (e) {
    this.setData({
      selectedDate1: e.detail.value
    });
  },
  // onDateChange1: function (e) {
  //   const selectedDate = e.detail.value; // Get selected date in YYYY-MM-DD format

  //   // Get selected time from another input field or event (e.g., time picker)
  //   const timePicker = document.getElementById('timePicker'); // Replace with your time picker's ID

  //   timePicker.addEventListener('timeChange', (event) => {
  //     const selectedTime = event.detail.selectedTime; // Replace with the property name containing the selected time
  //     // ... Rest of the code to combine date and time
  //   });
  //   // Combine date and time into a single timestamp or formatted string
  //   const dateTime = new Date(`${selectedDate} ${timePicker}`); // Example: Combine date and time

  //   this.setData({
  //     selectedDate1: dateTime.toISOString() // Store combined date and time in ISO format
  //   });
  // },

  // onTimeChange1: function (e) {
  //   this.setData({
  //     selectedTime1: e.detail.value
  //   });
  // },

  onDateChange2: function (e) {
    this.setData({
      selectedDate2: selectedDate2.datetimepicker()
    });
  },

  onTimeChange2: function (e) {
    this.setData({
      selectedTime2: e.detail.value
    });
  },
  
  onReady() {
    this.setCalendarData();
  },


  setCalendarData() {
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        tt.showToast({
          title: 'Đang lấy dữ liệu',
          icon: 'loading',
        })
        const access_token = res.data.access_token;
        getCalendarList(access_token).then((result) => {
          console.log(result.data.calendar_list);
          result.data.calendar_list.forEach(element => {
            that.data.dataLich.push(element);
            that.data.lich.push(element.summary);
            tt.showToast({
              title: 'Lấy dữ liệu thành công',
              icon: 'success',
              duration: 2000
            })
          });
        });
      }      
    })
  }
});