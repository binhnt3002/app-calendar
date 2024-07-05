import { sendRequest } from "../../utils/sendRequest";

const appVar = getApp();

Page({
  data: {
    date: new Date(),
    currYear: new Date().getFullYear(),
    currMonth: new Date().getMonth(),
    months: [
      "Tháng 1 - ",
      "Tháng 2 - ",
      "Tháng 3 - ",
      "Tháng 4 - ",
      "Tháng 5 - ",
      "Tháng 6 - ",
      "Tháng 7 - ",
      "Tháng 8 - ",
      "Tháng 9 - ",
      "Tháng 10 - ",
      "Tháng 11 - ",
      "Tháng 12 - ",
    ],
    currentDate: "",
    days: [],

    userInfo: {},

    // Chart configuration options

    styles: `
      height: 50vh;
      width: 100%;
    `,
    spec: {
      type: "pie",
      data: [
        {
          id: "data1",
          values: [],
        },
      ],
      outerRadius: 0.8,
      categoryField: "type",
      valueField: "value",

      //     label: {
      //       visible: true,
      //       position: 'top',
      //       offset: 2,
      //       style: {
      //         fill: '#333',
      //         fontWeight: 'bold'
      //       }
      // },

      legends: {
        visible: true,
        orient: "top",
        item: {
          visible: true,
          padding: {
            right: 30,
          },
          background: {
            style: {
              fill: "transparent",
            },
          },
        },
      },
    },

    spec2: {
      type: "pie",
      data: [
        {
          id: "data2",
          values: [],
        },
      ],
      outerRadius: 0.8,
      categoryField: "type",
      valueField: "value",

      legends: {
        visible: true,
        orient: "top",
        item: {
          visible: true,
          padding: {
            right: 10,
          },
          background: {
            style: {
              fill: "transparent",
            },
          },
        },
      },
    },

    spec3: {
      type: "pie",
      data: [
        {
          id: "data3",
          values: [],
        },
      ],
      outerRadius: 0.8,
      categoryField: "type",
      valueField: "value",

      legends: {
        visible: true,
        orient: "top",
        item: {
          visible: true,
          padding: {
            right: 10,
          },
          background: {
            style: {
              fill: "transparent",
            },
          },
        },
      },
    },

    spec4: {
      type: "bar",
      data: [
        {
          id: "data2",
          values: [],
        },
      ],
      xField: 'type',
      yField: 'value',
      seriesField: 'type',

      legends: [{ 
        visible: true, 
        position: 'middle', 
        orient: 'bottom' ,
        item: {
          visible: true,
          padding: {
            right: 10,
          },
         
        },
    }],
    },
  },

  onLoad() {
    // this.renderCalendar();
    this.getValueRecord();
  },

  getDataUser() {
    tt.getStorage({
      key: "user_info",
      success: (res) => {
        this.setData({
          userInfo: res.data,
        });
      },
    });
  },

  getValueRecord() {
    this.getDataUser();
    tt.getStorage({
      key: "user_access_token",
      success: (res) => {
        const access_token = res.data.access_token;
        const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${appVar.GlobalConfig.tableId}/records/search`;
        const headers = {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        };

        const body = {
          field_names: [
            "Việc cần làm",
            "Thể loại",
            "Quan trọng",
            "Cấp bách",
            "Số giờ cần có",
          ],

          filter: {
            conjunction: "and",
            conditions: [
              {
                field_name: "Person",
                operator: "is",
                value: [this.data.userInfo.open_id],
              },
            ],
          },
          automatic_fields: false,
        };

        tt.showToast({
          title: "đang tải dữ liệu",
          icon: "loading",
        }),
          sendRequest(url, "POST", headers, body).then((result) => {
            console.log(result);
            let that = this;
            let spec3 = this.data.spec3;
            spec3.data[0].values.push(
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Cấp bách"] == "1"
                  )?.length || 0,
                type: "Cấp bách 1",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Cấp bách"] == "2"
                  )?.length || 0,
                type: "Cấp bách 2",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Cấp bách"] == "3"
                  )?.length || 0,
                type: "Cấp bách 3",
              }
            );

            let spec2 = that.data.spec2;
            spec2.data[0].values.push(
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "A"
                  )?.length || 0,
                type: "A",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "B"
                  )?.length || 0,
                type: "B",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "C"
                  )?.length || 0,
                type: "C",
              }
            );

            let spec = that.data.spec;
            spec.data[0].values.push(
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Thể loại"] == "Việc chính"
                  )?.length || 0,
                type: "Việc chính",
              },

              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Thể loại"] == "Việc phát sinh"
                  )?.length || 0,
                type: "Việc phát sinh",
              },

              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Thể loại"] == "Việc cần đàn đốc"
                  )?.length || 0,
                type: "Việc cần đàn đốc",
              },

              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Thể loại"] == "Đọc & học"
                  )?.length || 0,
                type: "Đọc & học",
              },

              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Thể loại"] == "Dự án"
                  )?.length || 0,
                type: "Cấp bách",
              }
            );

            let spec4 = that.data.spec4;
            spec4.data[0].values.push(
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "A"
                  )?.length || 0,
                type: "A",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "B"
                  )?.length || 0,
                type: "B",
              },
              {
                value:
                  result.data.items.filter(
                    (item) => item.fields["Quan trọng"] == "C"
                  )?.length || 0,
                type: "C",
              }
            );

            that.setData({
              spec,
              spec2,
              spec3,
              spec4,
            });
            tt.showToast({
              title: "Tải dữ liệu thành công",
              icon: "success",
            });
          });
      },
    });
  },


});
