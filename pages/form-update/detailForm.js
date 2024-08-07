const bodyCreateTask = (eventTitle, eventDescription, timeStart, timeEnd,dateEndLoop, isLoop) => {
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
  if (isLoop) {
    body.recurrence = `FREQ=WEEKLY;UNTIL=${dateEndLoop}`
    return body;
  }
  return body;
}
const bodyScheduleParticipants = (type, id, res) => {
  const body = {
    attendees: [
      {
        type: type, //user, chat, resource, third_party
        is_optional: true,
        user_id: id,
        // "chat_id": "oc_xxxxxxxxx",
        // "room_id": "omm_xxxxxxxx",
        // "third_party_email": "wangwu@email.com",
        operate_id: res.data.open_id,
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
      },
    ],
    need_notification: true,
    is_enable_admin: false,
    // "instance_start_time_admin": "1647320400"
  };
  return body;
};
const bodyCreateRecord = (
  vieccanlam,
  theloai,
  quantrong,
  capbach,
  sogio,
  nguoi,
  batdau,
  ketthuc,
  ghichu,
  evId,
  caId
) => {
  const body = {
    fields: {
      "Việc cần làm": vieccanlam,
      "Thể loại": theloai,
      "Quan trọng": quantrong,
      "Cấp bách": capbach,
      "Số giờ cần có": sogio,
      Person: [
        {
          id: nguoi,
        },
      ],
      "Ngày - Giờ bắt đầu": batdau,
      "Ngày - Giờ kết thúc": ketthuc,
      "Ghi chú": ghichu,
      EventID: evId,
      CalendarID: caId,
    },
  };
  return body;
};
const bodyUpdateEvent = (changedTitle, startTime, endTime, description) => {
  const body = {
    summary: changedTitle,
    description: description,
    // "need_notification": true,
    start_time: {
      // "date": "2018-09-01",
      timestamp: startTime,
      // "timezone": "Asia/Shanghai"
    },
    end_time: {
      // "date": "2018-09-01",
      timestamp: endTime,
      // "timezone": "Asia/Shanghai"
    },
    // "visibility": "default", // default, public, private
    // "attendee_ability": "can_see_others", //none, can_see_others, can_invite_others, can_modify_event
    // "free_busy_status": "busy",
    // "reminders": [
    //   {
    //     "minutes": 5
    //   }
    // ],
  };
  return body;
};

const bodyUpdateRecord = () => {
  const body = {
    records: [
      {
        record_id: "recgVdQ7o7",
        fields: {
          manpower: 2,
          performer: [
            {
              id: "ou_debc524b2d8cb187704df652b43d29de",
            },
          ],
          description: "collect user feedbacks",
          "corresponding OKR": ["recqwIwhc6", "recOuEJMvN"],
          deadline: 1609516800000,
          completed: true,
          status: "complete",
          department: ["Sale", "Customer service"],
        },
      },
      {
        record_id: "recAu2ReK0",
        fields: {
          manpower: 2,
          performer: [
            {
              id: "ou_debc524b2d8cb187704df652b43d29de",
            },
          ],
          description: "collect user feedbacks",
          "corresponding OKR": ["recqwIwhc6", "recOuEJMvN"],
          deadline: 1609516800000,
          completed: true,
          status: "complete",
          department: ["Sale", "Customer service"],
        },
      },
    ],
  };
  return body;
};
export {
  bodyCreateTask,
  bodyScheduleParticipants,
  bodyCreateRecord,
  bodyUpdateEvent,
};
