import { searchRecord } from "../form-submit/function/apiFunction";
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
  },
  onShow(){
    this.listTask()
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
              "Ghi chú"
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
            vieccanlam.push({"col1":item.fields["Việc cần làm"][0].text}),
            theloai.push({"col2":item.fields["Thể loại"]}),
            quantrong.push({"col3":item.fields["Quan trọng"]}),
            capbach.push({"col4":item.fields["Cấp bách"]}),
            thu.push({"col5":item.fields["Thứ"].value[0].text})
            ngaygiobatdau.push({"col6":(item.fields["Ngày - Giờ bắt đầu"])}),
            ngaygioketthuc.push({"col7":item.fields["Ngày - Giờ kết thúc"]}),
            ghichu.push({"col8":item.fields["Ghi chú"][0].text})
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
              ...ghichu[index]
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
            thu
          })
        })
      }
    })
  },
  convertTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    // Option 1: Get date in a short format (e.g., "2024-07-11")
    const formattedDate = date.toDateString();
    return formattedDate; // Or formattedDateWithLocale depending on your preference
  }
});
