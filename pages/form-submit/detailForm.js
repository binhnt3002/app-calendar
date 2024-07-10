
//phần body của tạo event lấy từ base
const bodyCreateTask = (eventTitle, eventDescription, timeStart, timeEnd, visibilityType) => {
  const body =
  {
    "summary": eventTitle,
    "description": eventDescription,
    "need_notification": true,
    "start_time": {
      // "date": dateStart,
      "timestamp": timeStart,
    },
    "end_time": {
      // "date": dateEnd,
      "timestamp": timeEnd,
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
const bodyCreateRecord = (vieccanlam, theloai, quantrong, capbach, sogio, nguoi, batdau, ketthuc, ghichu, evId, caId) => {
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
      "Ghi chú": ghichu,
      "EventID": evId,
      "CalendarID": caId,
    }
  }
  return body
}
const bodyUpdateEvent = () => {
  const body =
  {
    "summary": "Event title",
    "description": "Event description",
    "need_notification": true,
    "start_time": {
      "date": "2018-09-01",
      "timestamp": "1602504000",
      "timezone": "Asia/Shanghai"
    },
    "end_time": {
      "date": "2018-09-01",
      "timestamp": "1602504000",
      "timezone": "Asia/Shanghai"
    },
    "visibility": "default", // default, public, private
    "attendee_ability": "can_see_others", //none, can_see_others, can_invite_others, can_modify_event
    "free_busy_status": "busy",
    "reminders": [
      {
        "minutes": 5
      }
    ],
    "recurrence": `FREQ=DAILY;INTERVAL=1`,
  }
  return body
}
export { bodyCreateTask, bodyScheduleParticipants, bodyCreateRecord, bodyUpdateEvent, bodyScheduleParticipantsGroup };