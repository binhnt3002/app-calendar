import { sendRequest } from "../../utils/sendRequest";

//tạo lịch mới là lấy calendar_id
const botCreateCalendar = (access_token, tittle, perm) => {
  const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  }
  const body = {
    "summary": tittle,
    "description": "Create a calendar by",
    "permissions": perm,
    "color": -1,
    "summary_alias": "Calendar alias"
  }
  sendRequest(url, 'POST', headers, body).then((rs) => {
    console.log("Tạo thành công");
    console.log(rs.data.calendar.calendar_id);
  })
}
//tìm lịch theo tenant hiển thị ra calendarID
const botSearchCalendar = (access_token, query) => {
  const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/search";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  }
  const body =
  {
    "query": query
  }
  sendRequest(url, 'POST', headers, body).then((rs) => {
    console.log(rs.data.items[0].calendar_id);
    return rs.data.items[0].calendar_id;
  })
}
//phần body của tạo event lấy từ base
const bodyCreateEvent = (eventTitle,eventDescription, dateStart, timeStart, dateEnd, timeEnd, visibilityType) => {
  // const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/"+calendar_id+"/events";
  // const headers = {
  //   'Content-Type': 'application/json',
  //   'Authorization': `Bearer ${access_token}`
  // }
  const body =
  {
    "summary": eventTitle,
    "description": eventDescription,
    "need_notification": true,
    "start_time": {
      "date": dateStart,
      // "timestamp": timeStart,
      // "timezone": "Asia/Shanghai"
    },
    "end_time": {
      "date": dateEnd,
      "timestamp": timeEnd,
      // "timezone": "Asia/Shanghai"
    },
    "visibility": visibilityType,
    // "attendee_ability": "can_see_others",
    "free_busy_status": "free",
    "color": -1,
    "reminders": [
      {
        "minutes": 5
      }
    ],
    "recurrence": "FREQ=DAILY;INTERVAL=2",
  }
  return body;
}
export { botCreateCalendar, botSearchCalendar, bodyCreateEvent };