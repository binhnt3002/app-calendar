
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
const bodyCreateRecord = (vieccanlam,theloai,quantrong,capbach,sogio,nguoi,batdau,ketthuc,ghichu,evId) =>{
  const body=
  {
    "fields": {
      "Việc cần làm": vieccanlam,
      "Thể loại": theloai,
      "Quan trọng": quantrong,
      "Cấp bách": capbach,
      "Số giờ cần có":sogio,
      "Người": [{
        "id": nguoi
      }],
      "Ngày - Giờ bắt đầu": 1674206443000,
      "Ngày - Giờ kết thúc": 1674206443000,
      "Ghi chú": ghichu,
      "EventID": evId,
    }
  }
  return body
}
export { bodyCreateTask, bodyScheduleParticipants, bodyCreateRecord };