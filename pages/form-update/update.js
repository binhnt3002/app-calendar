import { searchRecord, getCalendar, getAllTableName, getCalendarList, createEvent, createRecord, getListBusy } from "../function/apiFunction";
import {
  updateRecord,
  deleteRecord,
  deleteEvent,
} from "./function/apiFunction";
import { bodyUpdateEvent, bodyCreateTask } from "./detailForm";
import { sendRequest } from "../../utils/sendRequest";

const appVar = getApp();
const dayOptions = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
]

Page({
  data: {
    stt: [],
    tableData: [],
    oldData: [],
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
    selectedCategory: "",
    selectedurgent: "",
    selectedImportant: "",
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
    calendarID: "",
    selectedQuanTrong: "Tất cả",
    selectedCapBach: "Tất cả",
    selectedThu: "Tất cả",
    filterData: [],
    lich: [],
    chonlich: "",
    dataLich: [],
    isLoop: false,
    dailyData: [
      {
        "Thứ 2": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },

        "Thứ 3": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
        "Thứ 4": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
        "Thứ 5": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
        "Thứ 6": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
        "Thứ 7": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
        "Chủ nhật": {
          date: "",
          startTime: "",
          endTime: "",
          inputNote: "",
          isLoop: false,
        },
      },
    ],

    selectedDay: dayOptions[new Date().getDay()],

    dailyLoop: false,
    listBusy:[],
    checkBusy: []
  },

  // Function triggered when the calendar selection changes
  onCalendarChage: function (e) {
    // Update selected calendar data based on user selection
    this.setData({
      chonlich: this.data.lich[e.detail.value], // Selected calendar summary
      calendarID: this.data.dataLich.find( // Find calendar ID based on summary
        (item) => item.summary === this.data.lich[e.detail.value]
      ).calendar_id,
    });
  },

  // Function to fetch and set calendar data
  setCalendarData() {
    const that = this; // Cache 'this' for callback access
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        // Fetch calendar list using access token
        getCalendarList(access_token).then((result) => {
          console.log(result.data); // Log fetched calendar data (for debugging)
          this.setData({
            dataLich: result.data.calendar_list, // Update calendar list data
            lich: result.data.calendar_list.map((item) => item.summary), // Extract calendar summaries
            // (Commented out section: Potentially unused logic)
          });
          tt.showToast({
            title: "Lấy dữ liệu thành công", // Success toast message (in Vietnamese)
            icon: "success",
          });
        });
      },
    });
  },

  // Function to calculate total working hours (assuming dailyData structure)
  calculateTime() {
    let totalHours = 0;
    this.data.dailyData.forEach((item) => {
      // Check if data exists for the selected day in the current item
      if (item[this.data.selectedDay]) {
        const startTime = parseInt(item[this.data.selectedDay].startTime.split(":")[0]);
        const endTime = parseInt(item[this.data.selectedDay].endTime.split(":")[0]);
        totalHours += endTime - startTime; // Calculate total hours for the day
      }
    });
    return totalHours;
  },

  // Function to handle input note changes
  inputNote: function (e) {
    // Update input note state
    this.setData({
      inputNote: e.detail.value,
    });

    // Update note in dailyData (assuming structure)
    let data = this.data.dailyData;
    data[0][this.data.selectedDay].inputNote = this.data.inputNote;
    this.setData({
      dailyData: data,
    });
  },

  // Function to handle input title changes (potentially unused based on naming)
  inputTittle: function (e) {
    this.setData({
      inputValue: "title from code \n" + e.detail.value,
    });
  },

  // Function to handle selected hours changes (potentially unused based on naming)
  onSelectedHours: function (e) {
    this.setData({
      selectedHours: this.data.hours[e.detail.value], // Update selected hours state (unclear purpose)
    });
  },


  // Function to handle changes in start time (onTimeChange1)
  onTimeChange1: function (e) {
    // Update start time state
    this.setData({
      startTime: e.detail.value,
    });

    // Ensure end time is not earlier than start time
    if (this.data.startTime > this.data.endTime) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
  },

  // Function to handle changes in end time (onTimeChange2)
  onTimeChange2: function (e) {
    let that = this
    let checkBusy = this.data.checkBusy
    checkBusy = []
    // Update end time state
    this.setData({
      endTime: e.detail.value,
    });

    // Update dailyData with new time and note information
    let data = this.data.dailyData;
    data[0][this.data.selectedDay] = {
      date: this.data.selectedDayWork,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      inputNote: this.data.inputNote,
      isLoop: this.data.isLoop,
    };
    this.setData({
      dailyData: data,
    });

    // Ensure end time is not earlier than start time (redundant with onTimeChange1)
    if (this.data.startTime > this.data.endDate) {
      this.setData({
        endTime: this.data.startTime,
      });
    }
    checkBusy = {
      start: this.dateTimeToTimestamp(this.data.selectedDayWork,this.data.startTime),
      end:  this.dateTimeToTimestamp(this.data.selectedDayWork,this.data.endTime)
    }
    if (this.isDuringAnyBusyPeriod(checkBusy,this.data.listBusy) === false){
      tt.showModal({
        "title": "Cảnh báo",
        "content": "Đã có lịch trùng",
        "confirmText": "Tiếp",
        "cancelText": "Hủy",
        "showCancel": true,
        success(res) {
          console.log(JSON.stringify(res));
          if (res.confirm===false) {
            that.setData({
              endTime: "",
              startTime: "",
              totalHours: ""
            })
          } 
        },
        fail(res) {
          console.log(`showModal fail: ${JSON.stringify(res)}`);
        }
    });
    }
    this.setData({
      checkBusy
    })

    // Calculate total working hours (assuming relevant function exists)
    this.calculateTime();
  },

  // Function to handle changes in start date (onDateChange1)
  onDateChange1: function (e) {
    // Update start date state
    this.setData({
      startDate: e.detail.value,
    });

    // Ensure end date is not earlier than start date
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
        selectedDayWork: this.data.startDate,
      });
    }
  },

  // Function to handle changes in end date (onDateChange2)
  onDateChange2: function (e) {
    // Update end date state
    this.setData({
      endDate: e.detail.value,
    });

    // Ensure end date is not earlier than start date
    if (this.data.startDate > this.data.endDate) {
      this.setData({
        endDate: this.data.startDate,
      });
    }
  },

  // Function to handle changes in selected date (onDateChange3)
  onDateChange3: function (e) {
    // Update selected date state and corresponding work date
    this.setData({
      selectedDayWork: e.detail.value,
    });

    const selectedDate = new Date(e.detail.value);
    const dayOfWeek = selectedDate.getDay();

    // Array to map day of week to Vietnamese day names
    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayKey = dayNames[dayOfWeek];

    // Retrieve data for the selected day from dailyData
    let data = this.data.dailyData[0][dayKey];
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime,
      isLoop: data.isLoop,
      inputNote: data.inputNote,
    });

    // Update selected day key
    this.setData({
      selectedDay: dayKey,
    });
  },

  // Function to handle changes in daily loop checkbox (dailyLoopCheckBoxChange)
  dailyLoopCheckBoxChange: function (e) {
    const isChecked = e.currentTarget.dataset.check;

    // Update loop states based on checkbox state
    this.setData({
      dailyLoop: !isChecked,
      weekLoop: isChecked ? true : false, // Set weekLoop to true only if dailyLoop is unchecked
      isLoop: false,
    });
  },

  // Function to handle changes in checkbox (checkboxChange)
  checkboxChange: function (e) {
    const selectedDay = this.data.selectedDay;
    const selectedDayWork = this.data.selectedDayWork;
    const startTime = this.data.startTime;
    const endTime = this.data.endTime;
    const inputNote = this.data.inputNote;

    const dailyData = this.data.dailyData;
    const isLoop = !e.currentTarget.dataset.checked;

    // Update dailyData with new event information
    dailyData[0][selectedDay] = {
      date: selectedDayWork,
      startTime,
      endTime,
      inputNote,
      isLoop,
    };

    // Update loop and checkbox states based on checkbox state
    if (!e.currentTarget.dataset.checked) {
      this.setData({
        dailyLoop: false,
        dailyCheckBox: true,
        isLoop,
        dailyData,
      });
    } else {
      this.setData({
        dailyLoop: false,
        dailyCheckBox: false,
        isLoop,
        dailyData,
      });
    }
  },


  // Function to handle changes in the selected week (onWeekChange)
  onWeekChange: function (e) {
    // Update the selectedDay state with the corresponding day from dayOptions based on the selected index (e.detail.value)
    this.setData({
      selectedDay: this.data.dayOptions[e.detail.value],
    });
  },

  // Function called when the component is shown (onShow)
  onShow() {
    // Retrieve the access token from storage using tt.getStorageSync
    const accessToken = tt.getStorageSync("user_access_token").access_token;

    // Filter the table names to include only those containing "Bảng Phân Công" ("Task Assignment" in Vietnamese)
    const tableName = this.data.tableName.filter(({ name }) => name.includes("Bảng Phân Công"));

    // Extract the table ID from the first filtered table name object (assuming there's at least one)
    const tableId = tableName[0]?.table;

    // Function call (presumably defined elsewhere) to fetch all table names using the access token
    getAllTableName(accessToken).then((response) => {
      console.log(response); // Log the response for debugging purposes

      // Filter the response data to include only tables with names containing "Bảng Phân Công"
      const filteredTableName = response.data.items
        .filter(({ name }) => name.includes("Bảng Phân Công"))
        // Map the filtered data to an array of objects with name and table ID properties
        .map(({ name, table_id }) => ({ name, table: table_id }));

      // Update the tableName state with the filtered table names
      this.setData({ tableName: filteredTableName });

      // Call the listTask function (presumably defined elsewhere) to fetch tasks for the specific table ID
      this.listTask(this.data.tableName[0].table); // Assuming there's at least one table
    });
  },

  // Function to fetch and display task data (listTask)
  listTask() {
    // Reference to current component instance (often used within methods)
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
    let oldData = that.data.oldData;
    // Clear existing data in temporary arrays (presumably used for UI updates)

    dataRemove = [];
    dataRemoveAll = [];
    // Initialize empty arrays to store task data
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
    newData = [];
    oldData = [];
    sogiocanco = [];
    recordId = [];
    // Show a loading toast notification
    tt.showToast({
      title: "Đang tải !",
      icon: "loading",
      duration: 5000,
    });
    // Retrieve access token from storage
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        // Define body object for fetching data from Lark tables with specific fields
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
            "id"
          ],
          sort: [
            {
              field_name: "Thể loại", // Sort by category (ascending)
              asc: true,
            },
            {
              field_name: "Việc cần làm", // Then sort by task name (ascending)
              asc: true,
            },
          ],
          filter: {
            conjunction: "and", // Combine filter conditions with "AND" operator
            conditions: [
              {
                field_name: "Person", // Filter by current user's open ID
                operator: "is",
                value: [res.data.open_id],
              },
            ],
          },
          automatic_fields: false,
        };
        // Define another body object (presumably for a different table structure)
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
        // Send request to fetch data from the first Lark table using access token and body
        sendRequest(
          `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId2}/tables/${this.data.tableName[0].table}/records/search`,
          "POST",
          {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body2
        ).then((rs) => {
          // This section processes data retrieved from the Lark table and prepares it for display

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
              ngaylam: that.convertTimestampToDate(item.fields["Thời gian bắt đầu *"]),
              sogiocanco: item.fields["Số giờ cần có"],
              recordId: item.record_id,
              type: 'new',
              id: item.record_id
            };
          });

          // Sort the newData array by start date-time in descending order (newest tasks first)
          newData.sort((a, b) => {
            // Convert date strings to Date objects for comparison
            const dateA = new Date(a.ngaygiobatdau);
            const dateB = new Date(b.ngaygiobatdau);

            // Compare dates in descending order
            return dateB - dateA;
          });

          // Combine the processed newData with existing oldData (presumably containing previous tasks)
          tableData = [...newData, ...that.data.oldData]

          // Sort the combined tableData array by ID and then by date (for organized display)
          tableData.sort((a, b) => {
            // First sort by id
            if (a.id < b.id) {
              return 1;
            }
            if (a.id > b.id) {
              return -1;
            }
            return new Date(a.ngaylam) - new Date(b.ngaylam);
          });
          console.log(tableData);

          // Show a success toast notification
          tt.showToast({
            title: 'Đã cập nhật !',
            icon: 'success',
          })

          // Update component state with the processed data
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

        //Fetch data from TMT base
        searchRecord(access_token, body, appVar.GlobalConfig.tableId).then((result) => {
          const oldData = result.data.items.map((item) => {
            return {
              vieccanlam: item.fields["Việc cần làm"]?.[0]?.text || "",
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
              id: item?.fields?.["id"]?.[0]?.text,
            };
          });
          console.log(result);
          console.log(oldData);


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

  // Converts a timestamp (in milliseconds) to a formatted date string (YYYY-MM-DD)
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

  // Converts a date and time string to a timestamp (in seconds)
  dateTimeToTimestamp: function (date, time) {
    // Create a JavaScript Date object from the combined date and time string
    let datetime = new Date(`${date} ${time}`);
    // Get the timestamp in milliseconds and convert it to seconds
    let timestamp = datetime.getTime();
    return Math.floor(timestamp / 1000);
  },

  // Formats a date string as a UTC date string with time set to 00:00:00Z
  formatDateToUTC(dateString, days) {
    // Create a JavaScript Date object from the date string
    const date = new Date(dateString);
    // Add the specified number of days to the date
    date.setDate(date.getDate() + days);
    // Convert the date to ISO format and extract the date part
    const newDate = date.toISOString().split('T')[0]
    // Format the date as YYYYMMDD and append "T000000Z" for UTC time
    return newDate.replace(/-/g, "") + "T000000Z";
  },

  // Function to handle the edit action (presumably triggered by a button click)
  edit(e) {
    // Store a reference to 'this' for clarity and potential scoping issues
    let that = this;

    // Access the current edit state from component data
    let edit = that.data.edit;

    // Extract the event target ID (presumably the event ID of the task)
    const currentTarget = e.currentTarget.id;

    // Find the specific task object from tableData based on the event ID
    edit = that.data.tableData.find((obj) => obj.eventid === currentTarget);
    // Fetch calendar details using the user's access token (stored asynchronously)
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        getCalendar(res.data.access_token, edit.calendarid).then((rs) => {
          // Update component state with the fetched calendar name
          that.setData({ calendarname: rs.data.summary });
        });
      },
    });
    // Update component state to display the edit popup
    that.setData({
      turnPopup: true,
      turnMode: true,
      edit,
      selectedHours: edit.sogiocanco,
      startDate: edit.ngaygiobatdau,
      endDate: edit.ngaygioketthuc,
      inputNote: edit.ghichu,
      inputValue: edit.vieccanlam,

    });
  },

  // Function to handle the edit2 action (presumably triggered by a button click)
  edit2(e) {
    // Store a reference to 'this' for clarity and potential scoping issues
    let that = this;
    // Access the current edit state from component data (assuming it's already set)
    let edit = that.data.edit;
    let listBusy = that.data.listBusy;
    // Extract the event target ID (presumably the record ID of the task)
    const currentTarget = e.currentTarget.id;
    // Find the specific task object from tableData based on the record ID
    edit = that.data.tableData.find((obj) => obj.recordId === currentTarget);
    // Log the selected task object for debugging (optional)
    console.log(edit);
    if(new Date(e.currentTarget.dataset.date) < that.data.mindate){
      tt.showToast({
        title: "Task đã hết hạn",
        icon: "error",
        duration: 3000, // Show the success message for 3 seconds
      });
    } else {
      tt.getStorage({
        key: "user_access_token",
        success: (res) => {
          const access_token = res.data.access_token;
          const body = {
            "time_min": this.data.startDate+"T00:00:00Z",
            "time_max": this.data.endDate+"T23:59:59Z",
            "user_id": res.data.open_id,
          }
          
          getListBusy(access_token,body).then((rs) => {
            console.log(rs);
            rs.data?.freebusy_list?.map(i => listBusy.push({
              start: this.convertUTCtoGMT7Timestamp(i.start_time),
              end: this.convertUTCtoGMT7Timestamp(i.end_time)
            }))
            this.setData({
              listBusy
            })
          })
        }
      })
      // Call a function (presumably to set calendar data - unclear without context)
    that.setCalendarData();
      // Update component state to display the edit2 popup
    that.setData({
      turnPopup2: true,
      turnMode: true,
      edit,
      // selectedHours:"",
      selectedImportant: edit.quantrong,
      selectedCategory: edit.theloai,
      selectedurgent: edit.capbach,
      startDate: edit.ngaygiobatdau,
      endDate: edit.ngaygioketthuc,
      inputNote: edit.ghichu,
      inputValue: edit.vieccanlam,
      currentTarget
    });
    }
  },

  // Function to handle updating a task after editing
  update() {
    let that = this;
    // Reset edit state (presumably closes the edit popup and disables edit mode)
    that.setData({ turnPopup: false, turnMode: false, selectedFilter: "Tất cả" });
    // Retrieve the user's access token for Lark API calls
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const user_access_token = res.data.access_token;
        // Prepare data for calendar update
        let dataForCalendarUpdate = bodyUpdateEvent(
          that.data.inputValue,
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.startTime),
          that.dateTimeToTimestamp(that.data.edit.ngaylam, that.data.endTime),
          that.data.inputNote
        );
        // Construct the URL for updating the specific calendar event
        const url =
          "https://script.google.com/macros/s/AKfycbxhfDmKiziX7qCouyECEUH2djZnFU9HcybnpgXhT7NJ6f2hXr-mbjUZ6YDwuXdTa967/exec";
        // Set headers for the request

        const header = {
          "Content-Type": "application/json",
        };

        console.log(that.data.tableData);

        // Create the request body for updating the calendar event
        const body = {
          action: "updateCalendarOrEvent",
          url: `https://open.larksuite.com/open-apis/calendar/v4/calendars/${that.data.edit.calendarid}/events/${that.data.edit.eventid}`,
          user_access_token: user_access_token,
          body: {
            ...dataForCalendarUpdate,
          },
        };

        // Find the record ID of the task in the table data
        let findRecordId = that.data.tableData.find(
          (obj) => obj.vieccanlam === that.data.edit.vieccanlam
        ).recordId;
        console.log(findRecordId);

        // Prepare data for record update in Lark
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
        // Show a loading toast message
        let toastId = tt.showToast({
          title: "Đang cập nhật",
          icon: "loading",
          duration: 10000, // Set duration to 0 to make the toast stay indefinitely
        });

        // Send a POST request to update the calendar event
        sendRequest(url, "POST", header, body)
          .then((rs) => {
            updateRecord(tt.getStorageSync("user_access_token").access_token, dataForRecordUpdate, appVar.GlobalConfig.tableId)
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
    // Get the event ID of the current element
    const eventId = e.currentTarget.id;
    const that = this;
    // Check if both start time and end time are empty
    if (that.data.startTime == "" && that.data.endTime == "") {
      return tt.showToast({ title: "Trường thời gian đang trống !", icon: "warning", });
    }

    if (that.data.totalHours > that.data.selectedHours) {
      // Show a modal warning if the selected hours exceed the limit
      return tt.showModal({
        title: "Cảnh báo",
        content: `Thời gian 1 ngày là ${that.data.totalHours}h đã quá số giờ cần có. Vui lý thay đổi thời gian.`,
        confirmText: "Đóng",
        showCancel: false,
      })
    }

    // Show a confirmation modal to ask the user if they want to update the task
    tt.showModal({
      title: "Xác nhận cập nhật công việc",
      content: "Bạn có muốn cập nhật công việc này?",
      confirmText: "Ok",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          // If the user confirms, call the update function
          that.update();
        } else if (res.cancel) {
          // If the user cancels, log a message to the console
          console.log("User canceled update");
        }
      },
      fail(res) {
        // If there's an error showing the modal, log the error
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  deleteItem(e) {
    // Get references to "this" context and element ID
    let that = this;
    let index = e.id;
    let dataset = e.dataset.id;
    // Access existing data from component state
    let dataRemoveAll = that.data.dataRemoveAll;
    let dataRemove = that.data.dataRemove;
    // Reset dataRemove array (presumably for accumulating data to remove)
    dataRemove = [];
    // Create a copy of the table data to avoid modifying the original
    const newTabbleData = [...that.data.tableData];

    // Filter table data to exclude the item to be deleted (based on event ID)
    const dataAfterRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid !== index;
    });
    // Filter table data to get the specific item being deleted
    const tempRemove = newTabbleData.filter(function (phanTu) {
      return phanTu.eventid === index;
    });
    // Extract record ID and calendar ID from the deleted item(s) and push them to dataRemove
    tempRemove.map((i) =>
      dataRemove.push({ recordid: i.recordId, calendarid: i.calendarid })
    );
    // Similar logic, but accumulates record IDs for all items with the same "vieccanlam" value
    const tempRemoveAll = newTabbleData.filter(function (phanTu) {
      return phanTu.vieccanlam === dataset;
    });
    tempRemoveAll.map((i) => dataRemoveAll.push(i.recordId));

    // Update component state with filtered data and reset filters
    that.setData({
      tableData: dataAfterRemove,
      dataRemoveAll,
      dataRemove,
      selectedFilter: "Tất cả",
      filterData: dataAfterRemove,
    });

    // Asynchronous operations to delete data from server/database
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const body = {
          records: [e.dataset.record],
        };
        // Delete event from calendar using provided access token and IDs
        deleteEvent(
          res.data.access_token,
          that.data.dataRemove[0].calendarid,
          index
        ).then((result) => {
          console.log(result);
        });
        // Delete record(s) from Lark table using access token, body, and table ID
        deleteRecord(tt.getStorageSync("app_access_token"), body, appVar.GlobalConfig.tableId).then((rs) => {
          console.log(rs);
        });
      },
    });
  },

  confirmDelete(e) {
    // Get the current event object
    const eventId = e.currentTarget;
    console.log(e);
    const that = this;
    // Display a confirmation modal
    tt.showModal({
      title: "Xác nhận xóa công việc",
      content: "Bạn có muốn xóa công việc này ?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          // If the user confirms, call the deleteItem function
          that.deleteItem(eventId);
        } else if (res.cancel) {
          // If the user cancels, log a message to the console
          console.log("User canceled deletion");
        }
      },
      fail(res) {
        // If there's an error showing the modal, log the error
        console.log(`showModal fail: ${JSON.stringify(res)}`);
      },
    });
  },

  exit() {
    this.setData({ turnPopup: false, turnPopup2: false, turnMode: false });
    this.setData({ endTime: "", startTime: "", startDate: new Date().toISOString().substring(0, 10), endDate: "", inputNote: "", inputValue: "", selectedHours: "" })
  },

  createTask() {
    let that = this;
    that.setData({ turnPopup: false, turnMode: false, selectedFilter: "Tất cả" });

    if (that.calculateTime() > parseInt(that.data.selectedHours)) {
      return tt.showModal({
        title: "Thông báo",
        content: "Đã vượt quá giờ cho phép. Vui lòng chọn lại.",
        confirmText: "Đóng",
        showCancel: false,
      })
    }

    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        if (
          that.data.calendarID != "" &&
          that.data.inputValue != "" &&
          that.data.startDate != "" &&
          that.data.endDate != "" &&
          that.data.startTime != "" &&
          that.data.endTime != ""
        ) {

          tt.showToast({
            title: "Đang tạo",
            icon: "loading",
            duration: 5000,
          })

          if (that.data.dailyLoop == true) {
            for (const dataName in that.data.dailyData[0]) {
              const dataDay = that.data.dailyData[0][dataName];
              if (
                dataDay.date === "" ||
                dataDay.startTime === "" ||
                dataDay.endTime === ""
              ) {
                continue;
              }

              const body = bodyCreateTask(
                that.data.inputValue,
                dataDay.inputNote,
                this.dateTimeToTimestamp(
                  dataDay.date,
                  dataDay.startTime
                ).toString(),
                this.dateTimeToTimestamp(
                  dataDay.date,
                  dataDay.endTime
                ).toString(),
                that.formatDateToUTC(that.data.endDate, 1),
                false,
                that.data.dailyLoop
              );

              createEvent(access_token, that.data.calendarID, body).then(
                (rs) => {
                  console.log(rs);
                  const body2 = {
                    fields: {
                      "Việc cần làm": that.data.inputValue,
                      "Thể loại": that.data.selectedCategory,
                      "Quan trọng": that.data.selectedImportant,
                      "Cấp bách": that.data.selectedurgent,
                      "Số giờ cần có": parseInt(that.data.selectedHours),
                      "Person": [
                        {
                          id: res.data.open_id,
                        },
                      ],
                      "Ngày - Giờ bắt đầu":
                        this.dateTimeToTimestamp(that.data.startDate, "") * 1000,
                      "Ngày - Giờ kết thúc":
                        this.dateTimeToTimestamp(that.data.endDate, "") * 1000,
                      "Ghi chú": dataDay.inputNote,
                      "Ngày làm":
                        this.dateTimeToTimestamp(dataDay.date, "") * 1000,
                      "EventID": rs.data.event.event_id,
                      "CalendarID": that.data.calendarID,
                      "Số giờ của 1 ngày": Math.abs(
                        (this.dateTimeToTimestamp(dataDay.date, dataDay.endTime) -
                          this.dateTimeToTimestamp(dataDay.date, dataDay.startTime)) /
                        (60 * 60 * 1000)
                      ) * 1000,
                      "id": that.data.currentTarget
                    },
                  };

                  console.log(body2);
                  
                  createRecord(tt.getStorageSync("app_access_token"), body2, appVar.GlobalConfig.tableId).then(
                    (result) => {
                      console.log(result);
                      tt.showToast({
                        title: "Đã tạo",
                        icon: "success",
                        duration: 2000,
                      });
                    }
                  );
                }
              );
            }
            return;
          }


          //phân công task từng ngày (week loop)
          for (const dayName in that.data.dailyData[0]) {
            const dataDay = that.data.dailyData[0][dayName];

            if (
              dataDay.date === "" ||
              dataDay.startTime === "" ||
              dataDay.endTime === ""
            ) {
              continue;
            }

            const body = bodyCreateTask(
              that.data.inputValue,
              dataDay.inputNote,
              this.dateTimeToTimestamp(
                dataDay.date,
                dataDay.startTime
              ).toString(),
              this.dateTimeToTimestamp(
                dataDay.date,
                dataDay.endTime
              ).toString(),
              that.formatDateToUTC(that.data.endDate, 1),
              dataDay.isLoop
            );

            createEvent(access_token, that.data.calendarID, body).then(
              (rs) => {
                console.log(rs);
                const body2 = {
                  fields: {
                    "Việc cần làm": that.data.inputValue,
                    "Thể loại": that.data.selectedCategory,
                    "Quan trọng": that.data.selectedImportant,
                    "Cấp bách": that.data.selectedurgent,
                    "Số giờ cần có": parseInt(that.data.selectedHours),
                    "Person": [
                      {
                        id: res.data.open_id,
                      },
                    ],
                    "Ngày - Giờ bắt đầu":
                      this.dateTimeToTimestamp(that.data.startDate, "") * 1000,
                    "Ngày - Giờ kết thúc":
                      this.dateTimeToTimestamp(that.data.endDate, "") * 1000,
                    "Ghi chú": dataDay.inputNote,
                    "Ngày làm":
                      this.dateTimeToTimestamp(dataDay.date, "") * 1000,
                    "EventID": rs.data.event.event_id,
                    "CalendarID": that.data.calendarID,
                    "Số giờ của 1 ngày": Math.abs(
                      (this.dateTimeToTimestamp(dataDay.date, dataDay.endTime) -
                        this.dateTimeToTimestamp(dataDay.date, dataDay.startTime)) /
                      (60 * 60 * 1000)
                    ) * 1000,
                    "id": that.data.currentTarget
                  },
                };

                console.log(body2);
                createRecord(tt.getStorageSync("app_access_token"), body2, appVar.GlobalConfig.tableId).then((rs) => {
                  console.log(rs);
                  tt.showToast({
                    title: "Tạo xong công việc",
                    icon: "success",
                  });
                  this.listTask()
                  this.setData({
                    inputValue: "",
                    inputNote: "",
                    selectedCategory: "Việc chính",
                    selectedurgent: "1",
                    selectedImportant: "A",
                    selectedHours: "1",
                    startDate: "Chọn ngày",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    turnMode: false,
                    turnPopup2: false
                  });
                });
              }
            );
          }
        } else {
          tt.showToast({
            title: "Vui lòng nhập đầy đủ dữ liệu",
            icon: "error",
          });
        }
      },
    });
  },

  toggleFilter() {
    // Toggle the visibility of the filter picker component
    this.setData({
      showFilterPicker: !this.data.showFilterPicker,
    });
  },

  onFilterChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.theloaiOptions[index];
    // Update the selected filter in state
    that.setData({
      selectedFilter: selectedOption, // Update chosen
    });
    // Filter the table data based on selected options and existing filters
    that.setData({
      filterData: tableData.filter(item => {
        return (        // Filter by "The loai" (category)
          that.data.selectedFilter === "Tất cả" || item.theloai === that.data.selectedFilter) &&
          // Filter by "Quan trong" (importance)  
          (that.data.selectedQuanTrong === "Tất cả" || item.quantrong === that.data.selectedQuanTrong) &&
          // Filter by "Cap bach" (priority level)
          (that.data.selectedCapBach === "Tất cả" || item.capbach === that.data.selectedCapBach) &&
          // Filter by "Thu" (day of the week)  
          (that.data.selectedThu === "Tất cả" || item.thu === that.data.selectedThu)
        // ... similar conditions for other options
      })
    });
  },
  onQuanTrongChange(e) {
    let that = this;
    let tableData = that.data.tableData;
    let filterData = that.data.filterData;
    const index = e.detail.value;
    const selectedOption = that.data.quantrongOptions[index];
    // this.listTask()
    that.setData({
      selectedQuanTrong: selectedOption, //  Update chosen
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
      selectedCapBach: selectedOption, //  Update chosen
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
      selectedThu: selectedOption, //  Update chosen
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

  calculateTime() {
      // Initialize total hours to 0
    let totalHours = 0;
      // Calculate difference in hours between start and end time
    totalHours += parseInt(this.data.endTime.split(":")[0]) - parseInt(this.data.startTime.split(":")[0]);
      // Update component state with the calculated total hours
    this.setData({ totalHours })
      // Return the calculated total hours
    return totalHours;
  },

  convertUTCtoGMT7Timestamp: function (utcString) {
    // Create a Date object from the UTC string
    const utcDate = new Date(utcString);
    // Add the offset to the UTC date to get GMT+7 date
    const gmt7Date = new Date(utcDate.getTime() / 1000);
    // Return the timestamp of the GMT+7 date
    return gmt7Date.getTime();
  },

  isDuringAnyBusyPeriod: (check, list) => {
    for (const period of list) {      
        if (
          (check.start >= period.start && check.start < period.end) || // check.start is within a busy period
          (check.end > period.start && check.end <= period.end) || // check.end is within a busy period
          (check.start <= period.start && check.end >= period.end) // check fully encompasses a busy period
      ) {  
            return false; // Return false immediately if any condition is met
        }
    }
    return true; // Return true if no overlap is found
  },

});
