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
  })
}
const botCreateEvent = (access_token,calendar_id) => {
  const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/"+calendar_id+"/events";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  }
  const body =
  {
    "summary": "Event title",
    "description": "Event description",
    "need_notification": true,
    "start_time": {
      "date": "2018-09-01",
      // "timestamp": "1602504000",
      // "timezone": "Asia/Shanghai"
    },
    "end_time": {
      "date": "2018-09-01",
      // "timestamp": "1602504000",
      // "timezone": "Asia/Shanghai"
    },
    // "vchat": {
    //     "vc_type": "third_party",
    //     "icon_type": "vc",
    //     "description": "Initiate a video conference",
    //     "meeting_url": "https://example.com"
    // },
    "visibility": "public",
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
}
export { botCreateCalendar, botSearchCalendar };