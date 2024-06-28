import { getAuthorizationCode, getAppAccessToken, getUserInfo} from '../../utils/autherization.js';
import { botCreateCalendar, botSearchCalendar } from './detailForm.js';
Page({
  data: {
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
    importantOptions: ['A', 'B', 'C'],
    selectedImportant: 'A',
    userInfo: {},
    calendarID: "",
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
  onLoad(){
    let that = this;
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => { 
        console.log(res.data.access_token);
        that.setData({ userInfo: res.data })
        // botCreateCalendar(res.data.access_token,"hihi nini","public");
        tt.getStorage({
          key: 'app_access_token',
          success: (resp) => { 
            botSearchCalendar(resp.data,"hihi");
          },
          fail: (res) => {
            console.log('goi storage loi :', res.errMsg);
          },
          complete: (res) => {
            console.log('goi xong storage', res.errMsg);
          }
        })
      },
      fail: (res) => {
        console.log('goi storage loi :', res.errMsg);
      },
      complete: (res) => {
        console.log('goi xong storage', res.errMsg);
      }
    })
},
})
