import { searchRecord, getCalendar } from "../form-submit/function/apiFunction";
Page({
  data: {

    tittle: ["Tiêu đề","Tiêu đề","Tiêu đề","Tiêu đề","Tiêu đề","Tiêu đề"],
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
    turnPopup: false,
    calendarname: '',
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
              "Thứ",
              "Ngày - Giờ bắt đầu",
              "Ngày - Giờ kết thúc",
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
          })
          tableData = vieccanlam.map((item, index) =>{
            return {
              ...item,
              ...theloai[index],
              ...quantrong[index],
              ...capbach[index],
              ...thu[index],
              ...ngaygiobatdau[index],
              ...ngaygioketthuc[index],
              ...ghichu[index],
              ...eventid[index],
              ...calendarid[index]
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
            calendarid
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
      edit
    })
  },
  update() {
    this.setData({ turnPopup: false })
  },
  exit(){
    this.setData({turnPopup: false })
  }

});
