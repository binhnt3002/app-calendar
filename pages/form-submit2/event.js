Page({
  data: {
    events: [
      'event 1mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', 'event 2', 'event 3', 'event 4', 'event 5',
      'event 6', 'event 7', 'event 8', 'event 9', 'event 10',
      'event 11', 'event 12', 'event 13', 'event 14', 'event 15',
      'event 16', 'event 17', 'event 18', 'event 19', 'event 20'
    ],
    invite: [],
    inviteOpenId: [],
    frequencyOptions: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng '],
    selectedFrequency: 'Hàng ngày',
  },

  onLoad() {
    this.setEvents();
  },

  setEvents() {
    const events = this.data.events;
    this.setData({
      events: events
    });
  },

  onLoad() {
    this.setInvites();
  },

  setInvites(){
    const invite = this.data.invite;
    this.setData({
      invite : invite
    });
  },

  onFrequencyChange: function (e) {
    this.setData({
      selectedFrequency: this.data.frequencyOptions[e.detail.value]
    });
  },

  listUser(){
    let that = this;
    let invite = that.data.invite;
    let inviteOpenId = that.data.inviteOpenId;

    tt.chooseContact({
      multi: true,
      ignore: false,
      maxNum: 10,
      limitTips: 10,
      externalContact: true,
      enableChooseDepartment: true,
      disableChosenIds: [
          ...that.data.inviteOpenId
      ],
      success(res) {

        console.log(res);
  
        res.data.map(item =>{
          invite.push(item.name),
          inviteOpenId.push(item.openId)
        })
        
        that.setData({
          invite,
          inviteOpenId
        })
        console.log(that.data.invite);
        console.log(that.data.inviteOpenId);
      },
      fail(res) {
        console.log(`chooseContact fail: ${JSON.stringify(res)}`);
      }
  });
  }
});
