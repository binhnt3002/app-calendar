import { sendRequest } from "../../utils/sendRequest";

const appVar = getApp();

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

    valuesRecord: 0,

    // Chart configuration options

    canvasId: 'chartId', 
    events: [], 
    styles: `
      height: 50vh;
      width: 100%
    `, 
    spec: {
      type: 'pie',
      data: [
        {
          id: 'data1',
          values: [
            

          ]
        }
      ],
      outerRadius: 0.6,
      categoryField: 'name',
      valueField: 'value'
    }
  },

  onLoad() {
    // this.renderCalendar();
    this.getValueRecord();
  },


  getValueRecord() {
    tt.getStorage({
      key: 'user_access_token',
      success: (res) => {
        const access_token = res.data.access_token;
        const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${appVar.GlobalConfig.tableId}/records/search`;
        const headers = {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }

        const body = {
          "field_names": [
            "Việc cần làm",
            "Thể loại",
            "Quan trọng",
            "Cấp bách",
            "Số giờ cần có"
          ],

          "filter": {
            "conjunction": "and",
            "conditions": [
              {
                "field_name": "Person",
                "operator": "is",
                "value": [
                  "ou_9bab5b13719c7d1a8776627231696951"
                ]
              }
            ]
          },
          "automatic_fields": false
        }

        tt.showToast({
          title:"đang tải dữ liệu",
          icon:"loading"
        }),
        sendRequest(url, "POST", headers, body).then((result) => {
          let a = 0;
          let that = this;
          // result.data.items.filter(item => item.fields["Thể loại"] == "Việc chính" ? a++ : a)
          console.log(a);
        
          let spec = that.data.spec
          spec.data[0].values.push({
            value : a,
            name: "Việc chính"
          })

          that.setData({
            spec
          })
          tt.showToast({
            title:"Tải dữ liệu thành công",
            icon:"success"
          })

          
          
        })
      }  
    })
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
