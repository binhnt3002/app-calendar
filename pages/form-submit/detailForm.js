//phần body của tạo event lấy từ base
const bodyCreateEvent = (eventTitle,eventDescription, timeStart, timeEnd, visibilityType) => {
  const body =
  {
    "summary": eventTitle,
    "description": eventDescription,
    "need_notification": true,
    "start_time": {
      // "date": dateStart,
      "timestamp": timeStart,
      "timezone": "Asia/Shanghai"
    },
    "end_time": {
      // "date": dateEnd,
      "timestamp": timeEnd,
      "timezone": "Asia/Shanghai"
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
export {bodyCreateEvent};