Page({
  data: {
    events: [
      'event 1mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', 'event 2', 'event 3', 'event 4', 'event 5',
      'event 6', 'event 7', 'event 8', 'event 9', 'event 10',
      'event 11', 'event 12', 'event 13', 'event 14', 'event 15',
      'event 16', 'event 17', 'event 18', 'event 19', 'event 20'
    ],
    invite: [
      'Châu Đức Thạnh', 'Trương Hoàng Gay', 'Thảo Gay', 'Heloo GAy','Why are you gei','you are gay!','Châu Đức Thạnh', 'Trương Hoàng Gay', 'Thảo Gay', 'Heloo GAy','Why are you gei','you are gay!','Châu Đức Thạnh', 'Trương Hoàng Gay', 'Thảo Gay', 'Heloo GAy','Why are you gei','you are gay!','Châu Đức Thạnh', 'Trương Hoàng Gay', 'Thảo Gay', 'Heloo GAy','Why are you gei','you are gay!'
    ],
    weekOptions: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    selectedWeek: 'Tuần 1',
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

  onWeekChange: function (e) {
    this.setData({
      selectedWeek: this.data.weekOptions[e.detail.value]
    });
  },


});
