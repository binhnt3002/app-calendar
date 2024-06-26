Page({
  data: {

  },
  onLoad: function () {
    tt.setWindowSize({
      windowWidth: 1600,
      windowHeight: 900,
      x: 100,
      y: 100,
      success(res) {
        console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log(`setWindowSize fail: ${JSON.stringify(res)}`);
      },
    });
  },
})
