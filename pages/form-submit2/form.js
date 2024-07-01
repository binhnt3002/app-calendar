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

  // onDateChange1: function (e) {
  //   this.setData({
  //     selectedDate1: e.detail.value
  //   });
  // },
  onDateChange1: function (event) {
    const selectedDate = event.detail.value; 
    const timePicker = document.getElementById('timePicker'); // Replace with your time picker's ID

    timePicker.addEventListener('timeChange', (event) => {
      const selectedTime = event.detail.selectedTime; // Replace with the property name containing the selected time
    });

    const dateTime = new Date(`${selectedDate} ${timePicker}`); 

    this.setData({
      selectedDate1: dateTime.toISOString() // Store combined date and time in ISO format
    });
  },

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
  }
});