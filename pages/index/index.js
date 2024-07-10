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
    totalHoursInWeek:48
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
  calculateTotal(listItems,key, condition) {
    return listItems.reduce((total, item) => {
      if (item.fields[key] === condition) {
        return total + item.fields["Số giờ cần có"];
      }
      return total;
    }, 0);
  },
  onChangeHoursWeek(e){
    this.setData({
      totalHoursInWeek: e.detail.value
    })
    this.reloadDashboard()
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
          let listItems = result.data.items;
          let totalHours1 = this.calculateTotal(listItems,"Cấp bách", "1");
          let totalHours2 = this.calculateTotal(listItems,"Cấp bách", "2");
          let totalHours3 = this.calculateTotal(listItems,"Cấp bách", "3");
          let totalHoursQuanTrongA = this.calculateTotal(listItems,"Quan trọng", "A");
          let totalHoursQuanTrongB = this.calculateTotal(listItems,"Quan trọng", "B");
          let totalHoursQuanTrongC = this.calculateTotal(listItems,"Quan trọng", "C");


          let totalHours = totalHours1 + totalHours2 + totalHours3;
          let distance = totalHours - this.data.totalHoursInWeek;
          let spec3 = this.data.spec3;
          let spec2 = this.data.spec2;
          // Add percentage to each value
          if(distance>=0){
            spec3.data[0].values = [
              {
                value:totalHours1,
                type: "1: "+((totalHours1/totalHours)*100).toFixed(0)+" % - " + totalHours1 + " giờ",
              },
              {
                value: totalHours2,
                type: "2: "+((totalHours2/totalHours)*100).toFixed(0)+" % - " + totalHours2 + " giờ",
              },
              {
                value:totalHours3,
                type: "3: "+ ((totalHours3/totalHours)*100).toFixed(0)+" % - " + totalHours3 + " giờ",
              },
              {
                value:distance,
                type: "Thiếu: "+ ((distance/totalHours)*100).toFixed(0)+" % - " + distance + " giờ"
              }
            ];
            spec2.data[0].values = [
              {
                value:totalHoursQuanTrongA,
                type: "A: "+((totalHoursQuanTrongA/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongA + " giờ",
              },
              {
                value: totalHoursQuanTrongB,
                type: "B: "+((totalHoursQuanTrongB/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongB + " giờ",
              },
              {
                value:totalHoursQuanTrongC,
                type: "C: "+ ((totalHoursQuanTrongC/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongC + " giờ",
              },
              {
                value:distance,
                type: "Thiếu: "+ ((distance/totalHours)*100).toFixed(0)+" % - " + distance + " giờ"
              }
            ];

          }
          else {
            spec3.data[0].values = [
              {
                value:totalHours1,
                type: "1: "+((totalHours1/totalHours)*100).toFixed(0)+" % - " + totalHours1 + " giờ",
              },
              {
                value: totalHours2,
                type: "2: "+((totalHours2/totalHours)*100).toFixed(0)+" % - " + totalHours2 + " giờ",
              },
              {
                value:totalHours3,
                type: "3: "+ ((totalHours3/totalHours)*100).toFixed(0)+" % - " + totalHours3 + " giờ",
              },
              {
                value:-distance,
                type: "Dư: "+ ((-distance/totalHours)*100).toFixed(0)+" % - " + (-distance) + " giờ"
              }
            ];
            spec2.data[0].values = [
              {
                value:totalHoursQuanTrongA,
                type: "A: "+((totalHoursQuanTrongA/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongA + " giờ",
              },
              {
                value: totalHoursQuanTrongB,
                type: "B: "+((totalHoursQuanTrongB/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongB + " giờ",
              },
              {
                value:totalHoursQuanTrongC,
                type: "C: "+ ((totalHoursQuanTrongC/totalHours)*100).toFixed(0)+" % - " + totalHoursQuanTrongC + " giờ",
              },
              {
                value:-distance,
                type: "Dư: "+ ((-distance/totalHours)*100).toFixed(0)+" % - " + (-distance) + " giờ"
              }
            ];
          }

          // Calculate total values for percentage calculation
          const totalTheLoai = result.data.items.length;

          let spec4 = this.data.spec4;
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

        
          const percentA = ((totalHoursQuanTrongA/totalHours)*100).toFixed(0);
          const percentB = ((totalHoursQuanTrongB/totalHours)*100).toFixed(0);
          const percentC = ((totalHoursQuanTrongC/totalHours)*100).toFixed(0);
          
          const assessmentA = percentA > 65 ? "Tốt" : "Chưa tốt";
          const assessmentB = percentB < 30 ? "Tốt" : "Chưa tốt";
          const assessmentC = percentC >= 5 && percentC <= 10 ? "Tốt" : "Chưa tốt";
          


          const percent1 = ((totalHours1/totalHours)*100).toFixed(0);
          const percent2 = ((totalHours2/totalHours)*100).toFixed(0);
          const percent3 = ((totalHours3/totalHours)*100).toFixed(0);

          const assessment1 = percent1 > 65 ? "Tốt" : "Chưa tốt";
          const assessment2 = percent2 < 30 ? "Tốt" : "Chưa tốt";
          const assessment3 = percent3 >= 5 && percent3 <= 10 ? "Tốt" : "Chưa tốt";

          const distance1 = ((distance/totalHours)*100).toFixed(0);
          console.log(distance1)
          const percentdistance = distance1 < 10 ? "Tốt" : "Chưa tốt";


          this.setData({
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
            distance1,
            percentdistance
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