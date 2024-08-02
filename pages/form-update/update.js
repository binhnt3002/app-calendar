import { searchRecord, getCalendar,getAllTableName } from "../function/apiFunction";
import {
  updateRecord,
  deleteRecord,
  deleteEvent,
} from "./function/apiFunction";
import { bodyUpdateEvent } from "./detailForm";
import { sendRequest } from "../../utils/sendRequest";

const appVar = getApp();

Page({
  data: {
    stt: [],
    tableData: [],
    oldData:[],
    newData: [],
    vieccanlam: [],
    theloai: [],
    quantrong: [],
    capbach: [],
    thu: [],
    ghichu: [],
    ngaygiobatdau: [],
    ngaygioketthuc: [],
    eventid: [],
    calendarid: [],
    edit: [],
    ngaylam: [],
    sogiocanco: [],
    turnMode: false,
    turnPopup: false,
    turnPopup2: false,
    calendarname: "",
    hours: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    selectedDayWork: "",
    mindate: new Date(),
    startDate: new Date().toISOString().substring(0, 10),
    endDate: "",
    selectedHours: "",
    recordId: [],
    dataRemoveAll: [],
    dataRemove: [],
    endTime: "",
    startTime: "",
    inputNote: "",
    inputValue: "",
    showFilterPicker: false,
    theloaiOptions: [
      "Tất cả",
      "Việc chính",
      "Dự án",
      "Việc phát sinh",
      "Việc cần đôn đốc",
      "Đọc & học"
    ],
    quantrongOptions: ["Tất cả", "A", "B", "C"],
    capbachOptions: ["Tất cả", "1", "2", "3"],
    thuOptions: [
      "Tất cả",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ Nhật"],// Các giá trị trong combobox
    selectedFilter: "Tất cả", // Giá trị mặc định khi combobox mở ra

    filterTheloai: [],
    filterQuantrong: ["A", "B", "C"],
    selFilterQuantrong: "A",

    tableName: [],

    selectedQuanTrong: "Tất cả",
    selectedCapBach: "Tất cả",
    selectedThu: "Tất cả",
    filterData: [],

  },
  inputNote: function (e) {
    this.setData({
      inputNote: e.detail.value,
    });
  },

  inputTittle: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  onSelectedHours: function (e) {
    this.setData({
      selectedHours: this.data.hours[e.detail.value],
    });
  },

  onTimeChange1: function (e) {
    this.setData({
      startTime: e.detail.value,
    });

    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
  },

  onTimeChange2: function (e) {
    this.setData({
      endTime: e.detail.value,
    });
    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
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
      selectedDayWork: e.detail.value,
    });

    let now = new Date(e.detail.value);
    let dayOfWeek = now.getDay();

    let dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    let dayKey = dayNames[dayOfWeek];

    let data = this.data.dailyData[0][dayKey];
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime,
      isLoop: data.isLoop,
    });

    this.setData({
      selectedDay: dayKey,
    });
  },
  

  onShow() {
    const  accessToken  = tt.getStorageSync("user_access_token").access_token;
    const tableName = this.data.tableName.filter(({ name }) =>
      name.includes("Bảng Phân Công")
    );
    const tableId = tableName[0]?.table;

    getAllTableName(accessToken).then((response) => {
      console.log(response);
      const filteredTableName = response.data.items
        .filter(({ name }) => name.includes("Bảng Phân Công"))
        .map(({ name, table_id }) => ({ name, table: table_id }));

      this.setData({ tableName: filteredTableName });
      this.listTask(this.data.tableName[0].table);
    });
  },
  listTask() {
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
    let recordId = that.data.recordId;
    let dataRemoveAll = that.data.dataRemoveAll;
    let dataRemove = that.data.dataRemove;
    let newData = that.data.newData;
    let oldData= that.data.oldData;
    dataRemove = [];
    dataRemoveAll = [];
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
    newData =[];
    oldData = [];
    sogiocanco = [];
    recordId = [];
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        const body = {
          field_names: [
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
            "CalendarID",
          ],
          sort: [
            {
              field_name: "Thể loại",
              asc: true,
            },
            {
              field_name: "Việc cần làm",
              asc: true,
            },
          ],
          filter: {
            conjunction: "and",
            conditions: [
              {
                field_name: "Person",
                operator: "is",
                value: [res.data.open_id],
              },
            ],
          },
          automatic_fields: false,
        };

        const body2 = {
                  field_names: [
                    "Tên Task *",
                    "Thể loại",
                    "Quan Trọng",
                    "Cấp Bách",
                    "Số giờ cần có",
                    "Thứ",
                    "Thời gian bắt đầu *",
                    "Thời gian kết thúc *",
                    "Ngày làm",
                    "Ghi chú",
                    "EventID",
                    "CalendarID",
                  ],
                  sort: [
                    {
                      field_name: "Thể loại",
                      asc: true,
                    },
                    {
                      field_name: "Tên Task *",
                      asc: true,
                    },
                  ],
                  filter: {
                    conjunction: "and",
                    conditions: [
                      {
                        field_name: "Người làm *",
                        operator: "is",
                        value: [res.data.open_id],
                      },
                    ],
                  },
                  automatic_fields: false,
        };

        sendRequest(
          `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId2}/tables/${this.data.tableName[0].table}/records/search`,
          "POST",
          { Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",},
          body2
        ).then((rs) => {
          console.log(rs);
          newData = rs.data.items.map((item) => {
            return {
              vieccanlam: item.fields["Tên Task *"][0].text,
              theloai: item.fields["Thể loại"],
              quantrong: item.fields["Quan Trọng"],
              capbach: item.fields["Cấp Bách"],
              thu: item.fields["Thứ"].value[0].text,
              ngaygiobatdau: that.convertTimestampToDate(item.fields["Thời gian bắt đầu *"]),
              ngaygioketthuc: that.convertTimestampToDate(item.fields["Thời gian kết thúc *"]),
              ghichu: item.fields["Ghi chú"]?.[0].text || "",
              eventid: item.fields?.["EventID"]?.[0]?.text || "",
              calendarid: item.fields?.["CalendarID"]?.[0]?.text || "",
              ngaylam: that.convertTimestampToDate(item.fields["Ngày làm"]),
              sogiocanco: item.fields["Số giờ cần có"],
              recordId: item.record_id,
              type: 'new',
            };
          });
          
          newData.sort((a, b) => {
            // Convert date strings to Date objects for comparison
            const dateA = new Date(a.ngaygiobatdau);
            const dateB = new Date(b.ngaygiobatdau);
          
            // Compare dates in descending order
            return dateB - dateA;
          }); 
          // console.log(hi);
            tableData = [...newData,...that.data.oldData]
            that.setData({
              newData,
              tableData,
              filterData: tableData,
              capbach,
              quantrong,
              theloai,
              ngaygiobatdau,
              ngaygioketthuc,
              ghichu,
              vieccanlam,
              thu,
              eventid,
              calendarid,
              ngaylam,
              sogiocanco,
              recordId,
            });
        })


        //Lấy dữ liệu từ TMT
        searchRecord(access_token, body, appVar.GlobalConfig.tableId).then((result) => {
          console.log(result);
          const oldData = result.data.items.map((item) => {
            return {
              vieccanlam: item.fields["Việc cần làm"][0].text,
              theloai: item.fields["Thể loại"],
              quantrong: item.fields["Quan trọng"],
              capbach: item.fields["Cấp bách"],
              thu: item.fields["Thứ"].value[0].text,
              ngaygiobatdau: that.convertTimestampToDate(item.fields["Ngày - Giờ bắt đầu"]),
              ngaygioketthuc: that.convertTimestampToDate(item.fields["Ngày - Giờ kết thúc"]),
              ghichu: item.fields["Ghi chú"]?.[0].text || "",
              eventid: item.fields["EventID"][0].text, // Assuming single event ID
              calendarid: item.fields["CalendarID"][0].text, // Assuming single calendar ID
              ngaylam: that.convertTimestampToDate(item.fields["Ngày làm"]),
              sogiocanco: item.fields["Số giờ cần có"],
              recordId: item.record_id,
            };
          });
          
            that.setData({
              oldData,
              filterData: oldData,
              capbach,
              quantrong,
              theloai,
              ngaygiobatdau,
              ngaygioketthuc,
              ghichu,
              vieccanlam,
              thu,
              eventid,
              calendarid,
              ngaylam,
              sogiocanco,
              recordId,
            });
          
        });
      },
    });
  },

  convertTimestampToDate(timestamp) {
    // Create a new Date object with the given timestamp
    const date = new Date(timestamp);
    // Get the day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    // Format the date as dd/mm/yyyy
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  },

  dateTimeToTimestamp: function (date, time) {
    let datetime = new Date(`${date} ${time}`);
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },

  edit(e) {
    let that = this;
    let edit = that.data.edit;
    console.log(e);
    const currentTarget = e.currentTarget.id;
    edit = that.data.tableData.find((obj) => obj.eventid === currentTarget);
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        getCalendar(res.data.access_token, edit.calendarid).then((rs) => {
          that.setData({ calendarname: rs.data.summary });
        });
      },
    });
    that.setData({
      turnPopup: true,
      turnMode:true,
      edit,
      selectedHours: edit.sogiocanco,
      inputNote: edit.ghichu,
      inputValue: edit.vieccanlam,
    });
  },

  edit2(e) {
    let that = this;
    let edit = that.data.edit;
    console.log(e);
    const currentTarget = e.currentTarget.id;
    edit = that.data.tableData.find((obj) => obj.eventid === currentTarget);
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        getCalendar(res.data.access_token, edit.calendarid).then((rs) => {
          that.setData({ calendarname: rs.data.summary });
        });
      },
    });
    that.setData({
      turnPopup2: true,
      turnMode:true,
      edit,
      selectedHours: edit.sogiocanco,
      inputNote: edit.ghichu,
      inputValue: edit.vieccanlam,
    });
  },

  update() {
    let that = this;
    that.setData({ turnPopup: false, turnMode: false, selectedFilter: "Tất cả" });
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const user_access_token = res.data.access_token;
        let dataForCalendarUpdate = bodyUpdateEvent(
          that.data.inputValue,
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.startTime),
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.endTime),
          that.data.inputNote
        );
        const   url =
          "https://script.google.com/macros/s/AKfycbxhfDmKiziX7qCouyECEUH2djZnFU9HcybnpgXhT7NJ6f2hXr-mbjUZ6YDwuXdTa967/exec";
        const header = {
          "Content-Type": "application/json",
        };

        console.log(that.data.tableData);

        const body = {
          action: "updateCalendarOrEvent",
          url: `https://open.larksuite.com/open-apis/calendar/v4/calendars/${that.data.edit.calendarid}/events/${that.data.edit.eventid}`,
          user_access_token: user_access_token,
          body: {
            ...dataForCalendarUpdate,
          },
        };

        console.log(body);
        let findRecordId = that.data.tableData.find(
          (obj) => obj.vieccanlam === that.data.edit.vieccanlam
        ).recordId;
        console.log(findRecordId);

        let dataForRecordUpdate = {
          records: [
            {
              record_id: that.data.edit.recordId,
              fields: {
                "Ghi chú": that.data.inputNote,
              },
            },
          ],
        };
        console.log(dataForRecordUpdate);
        let toastId = tt.showToast({
          title: "Đang cập nhật",
          icon: "loading",
          duration: 10000, // Set duration to 0 to make the toast stay indefinitely
        });
        sendRequest(url, "POST", header, body)
          .then((rs) => {
            updateRecord(tt.getStorageSync("user_access_token").access_token, dataForRecordUpdate,appVar.GlobalConfig.tableId)
              .then((rs) => {
                console.log(rs);
                that.listTask();
                tt.hideToast({
                  toastId: toastId, // Use the toastId from the initial showToast call to hide it
                });
                // After all operations are done, show the success toast
                tt.showToast({
                  title: "Cập nhật công việc thành công",
                  icon: "success",
                  duration: 3000, // Show the success message for 3 seconds
                });
              })
              .catch((error) => {
                console.error("Update failed:", error);
                tt.hideToast({
                  toastId: toastId, // Ensure the loading toast is hidden even if there's an error
                });
                // Optionally, show an error toast to the user
                tt.showToast({
                  title: "Cập nhật thất bại",
                  icon: "error",
                  duration: 3000,
                });
              });
          })
          .catch((error) => {
            console.error("Request failed:", error);
            tt.hideToast({
              toastId: toastId, // Ensure the loading toast is hidden even if the request fails
            });
            // Optionally, show an error toast to the user
            tt.showToast({
              title: "Gửi yêu cầu thất bại",
              icon: "error",
              duration: 3000,
            });
          });
      },
    });
  },

  confirmUpdate(e) {
    const eventId = e.currentTarget.id;
    const that = this;
    if (that.data.startTime == ""&& that.data.endTime == "") {
      return tt.showToast({title: "Trường thời gian đang trống !", icon: "warning",});
    }
    tt.showModal({
      title: "Xác nhận cập nhật công việc",
      content: "Bạn có muốn cập nhật công việc này?",
      confirmText: "Ok",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.update();
        } else if (res.cancel) {
          console.log("User canceled update");
        }
      },
      fail(res) {
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  deleteItem(e) {
    let that = this;
    let index = e.id;
    let dataset = e.dataset.id;
    let dataRemoveAll = that.data.dataRemoveAll;
    let dataRemove = that.data.dataRemove;
    dataRemove = [];
    const newTabbleData = [...that.data.tableData];

    //dữ liệu sau khi bị xóa
    const dataAfterRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid !== index;
    });
    //dữ liệu từng phần tử bị xóa - cộng dồn
    const tempRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid === index;
    });

    tempRemove.map((i) =>
      dataRemove.push({ recordid: i.recordId, calendarid: i.calendarid })
    );
    //toàn bộ dữ liệu (có trùng) để xóa - cộng dồn
    const tempRemoveAll = newTabbleData.filter(function (phanTu) {
      return phanTu.vieccanlam === dataset;
    });
    tempRemoveAll.map((i) => dataRemoveAll.push(i.recordId));

    // console.log(dataRemove);
    // console.log(dataRemoveAll);
    // console.log(dataAfterRemove);
    that.setData({
      tableData: dataAfterRemove,
      dataRemoveAll,
      dataRemove,
      selectedFilter: "Tất cả",
      filterData: dataAfterRemove,
    });

    // xóa record
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const body = {
          records: [e.dataset.record],
        };
        deleteEvent(
          res.data.access_token,
          that.data.dataRemove[0].calendarid,
          index
        ).then((result) => {
          console.log(result);
        });
        deleteRecord(tt.getStorageSync("app_access_token"), body,appVar.GlobalConfig.tableId).then((rs) => {
          console.log(rs);
        });
      },
    });
  },

  confirmDelete(e) {
    const eventId = e.currentTarget;
    console.log(e);
    const that = this;

    tt.showModal({
      title: "Xác nhận xóa công việc",
      content: "Bạn có muốn xóa công việc này ?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.deleteItem(eventId);
        } else if (res.cancel) {
          console.log("User canceled deletion");
        }
      },
      fail(res) {
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  exit() {
    this.setData({ turnPopup: false, turnPopup2: false, turnMode: false });
  },

  toggleFilter() {
    this.setData({
      showFilterPicker: !this.data.showFilterPicker, // Đảo ngược trạng thái hiển thị
    });
  },

  onFilterChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.theloaiOptions[index];
    // this.listTask()
    that.setData({
      selectedFilter: selectedOption, // Cập nhật giá trị đã chọn
      // showFilterPicker: false // Đóng combobox sau khi chọn
    });
    that.setData({
      filterData: tableData.filter(item => {
        return (that.data.selectedFilter === "Tất cả" || item.theloai === that.data.selectedFilter) &&
               (that.data.selectedQuanTrong === "Tất cả" || item.quantrong === that.data.selectedQuanTrong) &&
               (that.data.selectedCapBach === "Tất cả" || item.capbach === that.data.selectedCapBach) &&
               (that.data.selectedThu === "Tất cả" || item.thu === that.data.selectedThu)
               // ... similar conditions for other options
      })
    });
    
    // Thực hiện các hành động khác khi thay đổi giá trị

  },
  onQuanTrongChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.quantrongOptions[index];
    // this.listTask()
    that.setData({
      selectedQuanTrong: selectedOption, // Cập nhật giá trị đã chọn
      // showFilterPicker: false // Đóng combobox sau khi chọn
    });
    that.setData({
      filterData: tableData.filter(item => {
        return (that.data.selectedFilter === "Tất cả" || item.theloai === that.data.selectedFilter) &&
               (that.data.selectedQuanTrong === "Tất cả" || item.quantrong === that.data.selectedQuanTrong) &&
               (that.data.selectedCapBach === "Tất cả" || item.capbach === that.data.selectedCapBach) &&
               (that.data.selectedThu === "Tất cả" || item.thu === that.data.selectedThu)
               // ... similar conditions for other options
      })
    });
  },
  onCapBachChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.capbachOptions[index];
    // this.listTask()
    that.setData({
      selectedCapBach: selectedOption, // Cập nhật giá trị đã chọn
      // showFilterPicker: false // Đóng combobox sau khi chọn
    });
    that.setData({
      filterData: tableData.filter(item => {
        return (that.data.selectedFilter === "Tất cả" || item.theloai === that.data.selectedFilter) &&
               (that.data.selectedQuanTrong === "Tất cả" || item.quantrong === that.data.selectedQuanTrong) &&
               (that.data.selectedCapBach === "Tất cả" || item.capbach === that.data.selectedCapBach) &&
               (that.data.selectedThu === "Tất cả" || item.thu === that.data.selectedThu)
               // ... similar conditions for other options
      })
    });
  },
  onThuChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.thuOptions[index];
    // this.listTask()
    that.setData({
      selectedThu: selectedOption, // Cập nhật giá trị đã chọn
      // showFilterPicker: false // Đóng combobox sau khi chọn
    });
    that.setData({
      filterData: tableData.filter(item => {
        return (that.data.selectedFilter === "Tất cả" || item.theloai === that.data.selectedFilter) &&
               (that.data.selectedQuanTrong === "Tất cả" || item.quantrong === that.data.selectedQuanTrong) &&
               (that.data.selectedCapBach === "Tất cả" || item.capbach === that.data.selectedCapBach) &&
               (that.data.selectedThu === "Tất cả" || item.thu === that.data.selectedThu)
               // ... similar conditions for other options
      })
    });
  }

});
