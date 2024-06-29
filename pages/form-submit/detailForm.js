
//phần body của tạo event lấy từ base
const bodyCreateEvent = (eventTitle, eventDescription, timeStart, timeEnd, visibilityType) => {
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
    "recurrence": "FREQ=DAILY;INTERVAL=2",
  }
  return body;
}
const bodyScheduleParticipants = (type,id,res) => {
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
    // "is_enable_admin": false,
    // "instance_start_time_admin": "1647320400"
  }
  return body;
}
export { bodyCreateEvent, bodyScheduleParticipants };