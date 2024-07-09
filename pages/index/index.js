import { sendRequest } from "../../utils/sendRequest";
import { createSpec } from "./spec/getSpec";

const appVar = getApp();

Page({
  data: {
    userInfo: {},

    // Chart configuration options

    styles: `
      height: 50vh;
      width: 100%
    `,
    // spec: createSpec("pie", "data1", 30, 0),

    spec2: createSpec("pie", "data2", 30, 0),

    spec3: createSpec("pie", "data3", 30, 0),

    spec4: createSpec("bar", "data4", 30, 0),
  },



  onShow() {
    let that = this;
    tt.showToast({
      title: "đợi khoảng 3 - 5s",
      icon: "loading",
    });
    setTimeout(() => {
      that.reloadDashboard();
    }, 3000);


  },

  getValueRecord() {
    const addInfor = {
      xField: "type",
      yField: "value",
      seriesField: "type",
    };
    Object.assign(this.data.spec4, addInfor);

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
                value: [res.data.open_id],
              },
            ],
          },
          automatic_fields: false,
        };


        sendRequest(url, "POST", headers, body).then((result) => {
          console.log(result.data);
          let that = this;

          // Calculate total values for percentage calculation
          const totalCapBach = result.data.items.length;
          const totalQuanTrong = result.data.items.length;
          const totalTheLoai = result.data.items.length;

          let spec3 = this.data.spec3;
          spec3.data[0].values = [
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
          ];

          // Add percentage to each value
          spec3.data[0].values = spec3.data[0].values.map((item) => {
            const percentage = ((item.value / totalCapBach) * 100).toFixed();
            item.type = `${item.type}: ${percentage}%`;
            return item;
          });

          let spec2 = that.data.spec2;
          spec2.data[0].values = [
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
          ];

          // Add percentage to each value
          spec2.data[0].values = spec2.data[0].values.map((item) => {
            const percentage = ((item.value / totalQuanTrong) * 100).toFixed(0);
            item.type = `${item.type}: ${percentage}%`;
            return item;

          });


          let spec4 = that.data.spec4;
          spec4.data[0].values = [
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
                  (item) => item.fields["Thể loại"] == "Việc cần đôn đốc"
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
              type: "Dự án",
            }
          ];


          // Add percentage to each value
          spec4.data[0].values = spec4.data[0].values.map((item) => {
            const percentage = ((item.value / totalTheLoai) * 100).toFixed(0);
            item.type = `${item.type}: ${percentage}%`;
            return item;
          });

          // Update the percentage values in the text elements
          const percentA = parseFloat(spec2.data[0].values.find(item => item.type.startsWith('A')).type.split(': ')[1]);
          const percentB = parseFloat(spec2.data[0].values.find(item => item.type.startsWith('B')).type.split(': ')[1]);
          const percentC = parseFloat(spec2.data[0].values.find(item => item.type.startsWith('C')).type.split(': ')[1]);


          const percent1 = parseFloat(spec3.data[0].values.find(item => item.type.startsWith('Cấp bách 1')).type.split(': ')[1]);
          const percent2 = parseFloat(spec3.data[0].values.find(item => item.type.startsWith('Cấp bách 2')).type.split(': ')[1]);
          const percent3 = parseFloat(spec3.data[0].values.find(item => item.type.startsWith('Cấp bách 3')).type.split(': ')[1]);

          const assessmentA = percentA > 65 ? "Tốt" : "Chưa tốt";
          const assessmentB = percentB < 30 ? "Tốt" : "Chưa tốt";
          const assessmentC = percentC >= 5 && percentC <= 10 ? "Tốt" : "Chưa tốt";

          const assessment1 = percent1 > 65 ? "Tốt" : "Chưa tốt";
          const assessment2 = percent2 < 30 ? "Tốt" : "Chưa tốt";
          const assessment3 = percent3 >= 5 && percent3 <= 10 ? "Tốt" : "Chưa tốt";


          that.setData({
            spec2,
            spec3,
            spec4,
            percentA,
            percentB,
            percentC,
            assessmentA,
            assessmentB,
            assessmentC,
            percent1,
            percent2,
            percent3,
            assessment1,
            assessment2,
            assessment3,
          });

        });
      },
    });


  },

  reloadDashboard: function () {
    // this.data.spec.data[0].values = [];
    this.data.spec2.data[0].values = [];
    this.data.spec3.data[0].values = [];
    this.data.spec4.data[0].values = [];
    this.getValueRecord();
  },

});
