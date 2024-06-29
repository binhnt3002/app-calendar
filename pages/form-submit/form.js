import {getCalendarList} from './function/apiFunction';

Page({
  data: {
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
    importantOptions: ['A', 'B', 'C'],
    selectedImportant: 'A',
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
})
