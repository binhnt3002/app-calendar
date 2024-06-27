// import { getUserInfo, getBodyByDemand } from './detail';
// import { sendRequest } from '../../utils/sendRequest';

Page({
  data: {
    date: new Date(),
    currYear: new Date().getFullYear(),
    currMonth: new Date().getMonth(),
    months: [
      "Tháng 1 - ", "Tháng 2 - ", "Tháng 3 - ", "Tháng 4 - ", "Tháng 5 - ",
      "Tháng 6 - ", "Tháng 7 - ", "Tháng 8 - ", "Tháng 9 - ", "Tháng 10 - ",
      "Tháng 11 - ", "Tháng 12 - "
    ],
    currentDate: '',
    days: [],
  },

  onLoad() {
    this.renderCalendar();
  },


  renderCalendar() {
    const { currYear, currMonth, date, months } = this.data;
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = [];

    for (let i = firstDayofMonth; i > 0; i--) {
      liTag.push({ day: lastDateofLastMonth - i + 1, inactive: true });
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear();
      liTag.push({ day: i, active: isToday });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      liTag.push({ day: i - lastDayofMonth + 1, inactive: true });
    }

    this.setData({
      currentDate: `${months[currMonth]} ${currYear}`,
      days: liTag
    });
  },

  handlePrevNext(e) {
    const { id } = e.currentTarget;
    let { currYear, currMonth, date } = this.data;

    currMonth = id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      let newDate = new Date(currYear, currMonth, 1);
      currYear = newDate.getFullYear();
      currMonth = newDate.getMonth();
      date = newDate;
    } else {
      date = new Date();
    }

    this.setData({
      currYear,
      currMonth,
      date
    });

    this.renderCalendar();
    this.fetchUserData();
  },

  
});
