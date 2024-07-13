import { searchRecord, getCalendar } from "../form-submit/function/apiFunction";
Page({
  data: {
    tableData: [],
    vieccanlam: [],
    theloai: [],
    quantrong: [],
    capbach: [],
    thu:[],
    ghichu: [],
    ngaygiobatdau: [],
    ngaygioketthuc: [],
    eventid: [],
    calendarid:[],
    edit: [],
    ngaylam:[],
    sogiocanco:[],
    turnPopup: false,
    calendarname: '',
    hours: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    selectedDayWork:'',
    mindate: new Date(),
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '',
    selectedHours:'',
  },
  onSelectedHours: function (e) {
    this.setData({
      selectedHours: this.data.hours[e.detail.value],
    });
  },

  onDateChange1: function (e) {
    this.setData({
      startDate: e.detail.value,
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
        selectedDayWork: this.data.startDate,
      });
    }

    console.log(this.data.startDate);
  },

  onDateChange2: function (e) {
    this.setData({
      endDate: e.detail.value,
    });
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
      });
    }
  },

  onDateChange3: function (e) {
    this.setData({
      selectedDayWork : e.detail.value,
    });


    let now = new Date(e.detail.value);
    let dayOfWeek = now.getDay();

    let dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    let dayKey = dayNames[dayOfWeek];

    let data = this.data.dailyData[0][dayKey];
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime,
      isLoop: data.isLoop
    });

    this.setData({
      selectedDay: dayKey,
    });

    // let now = new Date(e.detail.value)

    // let data = this.data.dailyData[0]["Thứ " + ((now.getDay() + 6) % 7 + 1)];
    // this.setData({
    //   startTime: data.startTime,
    //   endTime: data.endTime,
    //   isLoop: data.isLoop
    // })

    // let currentDate = new Date(e.detail.value);
    // if (currentDate.getDay() === 1) {
    //   this.setData({
    //     selectedDay: "Thứ 2",
    //   });
    // } else if (currentDate.getDay() === 2) {
    //   this.setData({
    //     selectedDay: "Thứ 3",
    //   });
    // } else if (currentDate.getDay() === 3) {
    //   this.setData({
    //     selectedDay: "Thứ 4",
    //   });
    // } else if (currentDate.getDay() === 4) {
    //   this.setData({
    //     selectedDay: "Thứ 5",
    //   });
    // } else if (currentDate.getDay() === 5) {
    //   this.setData({
    //     selectedDay: "Thứ 6",
    //   });
    // } else if (currentDate.getDay() === 6) {
    //   this.setData({
    //     selectedDay: "Thứ 7",
    //   });
    // }
    // else if (currentDate.getDay() === 0) {
    //   this.setData({
    //     selectedDay: "Chủ nhật",
    //   });
    },

  onShow(){
    let that = this;
    that.listTask()
  },
  listTask(){
    let that = this;
    let vieccanlam = that.data.vieccanlam;
    let theloai = that.data.theloai;
    let quantrong = that.data.quantrong;
    let capbach = that.data.capbach;
    let thu = that.data.thu;
    let ghichu = that.data.ghichu;
    let ngaygiobatdau = that.data.ngaygiobatdau;
    let ngaygioketthuc = that.data.ngaygioketthuc;
    let eventid = that.data.eventid;
    let calendarid = that.data.calendarid;
    let tableData = that.data.tableData;
    let ngaylam = that.data.ngaylam;
    let sogiocanco = that.data.sogiocanco;
    vieccanlam = [];
    theloai = [];
    capbach = [];
    quantrong = [];
    thu = [];
    ngaygiobatdau = [];
    ngaygioketthuc = [];
    ghichu = [];
    eventid = [];
    calendarid = [];
    ngaylam = [];
    tableData = [];
    sogiocanco = [];
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const access_token = res.data.access_token;
        const body = {
          "field_names": [
              "Việc cần làm",
              "Thể loại",
              "Quan trọng",
              "Cấp bách",
              "Số giờ cần có",
              "Thứ",
              "Ngày - Giờ bắt đầu",
              "Ngày - Giờ kết thúc",
              "Ngày làm",
              "Ghi chú",
              "EventID",
              "CalendarID"
          ],
          "filter": {
              "conjunction": "and",
              "conditions": [
                  {
                      "field_name": "Person",
                      "operator": "is",
                      "value": [
                          res.data.open_id
                      ]
                  }
              ]
          },
          "automatic_fields": false
      }
        searchRecord(access_token,body).then((result)=>{
          console.log(result);
          result.data.items.map(item => {
            vieccanlam.push({"vieccanlam":item.fields["Việc cần làm"][0].text}),
            theloai.push({"theloai":item.fields["Thể loại"]}),
            quantrong.push({"quantrong":item.fields["Quan trọng"]}),
            capbach.push({"capbach":item.fields["Cấp bách"]}),
            thu.push({"thu":item.fields["Thứ"].value[0].text})
            ngaygiobatdau.push({"ngaygiobatdau":that.convertTimestampToDate(item.fields["Ngày - Giờ bắt đầu"])}),
            ngaygioketthuc.push({"ngaygioketthuc":that.convertTimestampToDate(item.fields["Ngày - Giờ kết thúc"])}),
            ghichu.push({"ghichu":item.fields["Ghi chú"][0].text}),
            eventid.push({"eventid": item.fields["EventID"][0].text}),
            calendarid.push({"calendarid": item.fields["CalendarID"][0].text})
            ngaylam.push({"ngaylam":that.convertTimestampToDate(item.fields["Ngày làm"])})
            sogiocanco.push({"sogiocanco": item.fields["Số giờ cần có"]})
            tableData = vieccanlam.map((item, index) =>{
              return {
                ...item,
                ...theloai[index],
                ...quantrong[index],
                ...capbach[index],
                ...thu[index],
                ...ngaygiobatdau[index],
                ...ngaygioketthuc[index],
                ...ngaylam[index],
                ...ghichu[index],
                ...eventid[index],
                ...calendarid[index],
                ...sogiocanco[index]
              }
            })
            that.setData({
              capbach,
              quantrong,
              theloai,
              ngaygiobatdau,
              ngaygioketthuc,
              ghichu,
              vieccanlam,
              tableData,
              thu,
              eventid,
              calendarid,
              ngaylam,
              sogiocanco,
            })
          })
        })
      }
    })
  },

  convertTimestampToDate(timestamp) {
    // Create a new Date object with the given timestamp
    const date = new Date(timestamp);
  
    // Get the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    // Format the date as dd/mm/yyyy
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  },
  

  edit(e) {
    let that = this;
    let edit = that.data.edit;
    console.log(e);
    const currentTarget = e.currentTarget.id
    edit = that.data.tableData.find(obj => obj.eventid===currentTarget)
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        getCalendar(res.data.access_token,edit.calendarid).then((rs)=>{
          that.setData({calendarname: rs.data.summary})
        })
      }
    })
    that.setData({ 
      turnPopup: true,
      edit,
      selectedHours: edit.sogiocanco
    })
  },
  update() {
    this.setData({ turnPopup: false })
  }

});
