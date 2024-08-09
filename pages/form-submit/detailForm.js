
//phần body của tạo event lấy từ base
const bodyCreateTask = (eventTitle, eventDescription, timeStart, timeEnd, dateEndLoop, weekLoop, dailyLoop) => {
  const body =
  {
    "summary": eventTitle,
    "description": eventDescription,
    "need_notification": true,
    "start_time": {
      // "date": dateStart,
      "timestamp": timeStart,
      "timezone": "Asia/Ho_Chi_Minh"
    },
    "end_time": {
      // "date": dateEnd,
      "timestamp": timeEnd,
      "timezone": "Asia/Ho_Chi_Minh"
    },
    "visibility": "default",
    // "attendee_ability": "can_see_others",
    "free_busy_status": "busy",
    "color": -1,
    "reminders": [
      {
        "minutes": 5
      }
    ],
    "recurrence": ""
  }
  
  if (weekLoop) {
    body.recurrence = `FREQ=WEEKLY;UNTIL=${dateEndLoop}`
    return body;
  }

  if (dailyLoop) {
    body.recurrence = `FREQ=DAILY;UNTIL=${dateEndLoop}`
    return body;
  }
  
  return body;
}
const bodyScheduleParticipants = (type, id, res) => {
  const body =
  {
    "attendees": [
      {
        "type": type, //user, chat, resource, third_party
        "is_optional": true,
        "user_id": id,
        // "chat_id": "oc_xxxxxxxxx",
        // "room_id": "omm_xxxxxxxx",
        // "third_party_email": "wangwu@email.com",
        "operate_id": res.data.open_id,
        // "resource_customization": [
        //   {
        //     "index_key": "16281481596100",
        //     "input_content": "xxx",
        //     "options": [
        //       {
        //         "option_key": "16281481596185",
        //         "others_content": "xxx"
        //       }
        //     ]
        //   }
        // ]
      }
    ],
    "need_notification": true,
    "is_enable_admin": false,
    // "instance_start_time_admin": "1647320400"
  }
  return body;
}
const bodyScheduleParticipantsGroup = (type, id, res) => {
  const body =
  {
    "attendees": [
      {
        "type": type, //user, chat, resource, third_party
        "is_optional": true,
        // "user_id": id,
        "chat_id": id,
        // "room_id": "omm_xxxxxxxx",
        // "third_party_email": "wangwu@email.com",
        "operate_id": res.data.open_id,
      }
    ],
    "need_notification": true,
    "is_enable_admin": false,
  }
  return body;
}
const bodyCreateRecord = (vieccanlam, theloai, quantrong, capbach, sogio, nguoi, batdau, ketthuc,ngaylam, ghichu, evId, caId) => {
  const body =
  {
    "fields": {
      "Việc cần làm": vieccanlam,
      "Thể loại": theloai,
      "Quan trọng": quantrong,
      "Cấp bách": capbach,
      "Số giờ cần có": sogio,
      "Person": [{
        "id": nguoi
      }],
      "Ngày - Giờ bắt đầu": batdau,
      "Ngày - Giờ kết thúc": ketthuc,
      "ngày làm":ngaylam,
      "Ghi chú": ghichu,
      "EventID": evId,
      "CalendarID": caId,
    }
  }
  return body
}

export { bodyCreateTask, bodyScheduleParticipants, bodyCreateRecord, bodyScheduleParticipantsGroup };