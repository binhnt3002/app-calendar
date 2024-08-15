import { sendRequest } from "../../utils/sendRequest";
import { createSpec } from "./spec/getSpec";
import { getAllTableName } from "../function/apiFunction";

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
    totalHoursInWeek: 48,

    tableName: [],
    allData: [],
  },

  onShow() {
    let that = this;
    this.auth = setInterval(() => {
      let isComplete = tt.getStorageSync("isComplete");
      tt.showToast({
        title: "Vui lòng đợi !",
        icon: "loading",
        duration: 7000,
      });
      if (isComplete) {
        clearInterval(this.auth);
        that.reloadDashboard();
      }
    }, 1000);
  },
  calculateTotal(listItems, key, condition, totalItems) {
    if (totalItems == 0) {
      return 0;
    }
    return listItems.reduce((total, item) => {
      if (item.fields[key] === condition) {
        return total + item.fields["Số giờ cần có"];
      }
      return total;
    }, 0);
  },

  onChangeHoursWeek(e) {
    if (e.detail.value > 48 || e.detail.value < 1) {
      return tt.showModal({
        title: "Thông báo",
        content: "thời gian trong tuần khoảng 1h - 48h.",
        confirmText: "Đóng",
        showCancel: false,
        success: () => {
          this.setData({
            totalHoursInWeek: ""
          })
        },
      })
    }
    this.setData({
      totalHoursInWeek: e.detail.value,
    });
    this.reloadDashboard();
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
          if (result.data.items == null) {
            return tt.showToast({
              title: "Không có dữ liệu",
              icon: "info",
              duration: 4000,
            })
          }
          console.log(result.data);
          let data = [...result.data.items];
          let listItems = data || 0;
          let listItemsLength = data.length || 0;
          let totalHours1 = this.calculateTotal(
            listItems,
            "Cấp bách",
            "1",
            listItemsLength
          );
          let totalHours2 = this.calculateTotal(
            listItems,
            "Cấp bách",
            "2",
            listItemsLength
          );
          let totalHours3 = this.calculateTotal(
            listItems,
            "Cấp bách",
            "3",
            listItemsLength
          );
          let totalHoursQuanTrongA = this.calculateTotal(
            listItems,
            "Quan trọng",
            "A",
            listItemsLength
          );
          let totalHoursQuanTrongB = this.calculateTotal(
            listItems,
            "Quan trọng",
            "B",
            listItemsLength
          );
          let totalHoursQuanTrongC = this.calculateTotal(
            listItems,
            "Quan trọng",
            "C",
            listItemsLength
          );

          let totalHours = totalHours1 + totalHours2 + totalHours3;
          let distance = this.data.totalHoursInWeek - totalHours;
          let spec3 = this.data.spec3;
          let spec2 = this.data.spec2;
          // Add percentage to each value
          function calculatePercentage(value, total) {
            return ((value / total) * 100).toFixed(0);
          };
          if (distance >= 0) {
            // Trường hợp thiếu giờ
            spec3.data[0].values = [
              {
                value: totalHours1,
                type: "Cấp bách 1: " + calculatePercentage(totalHours1, this.data.totalHoursInWeek) + "% - " + totalHours1 + " giờ",
              },
              {
                value: totalHours2,
                type: "Cấp bách 2: " + calculatePercentage(totalHours2, this.data.totalHoursInWeek) + "% - " + totalHours2 + " giờ",
              },
              {
                value: totalHours3,
                type: "Cấp bách 3: " + calculatePercentage(totalHours3, this.data.totalHoursInWeek) + "% - " + totalHours3 + " giờ",
              },
              {
                value: distance,
                type: "Thiếu: " + calculatePercentage(distance, this.data.totalHoursInWeek) + "% - " + distance + " giờ",
              },
            ];
            spec2.data[0].values = [
              {
                value: totalHoursQuanTrongA,
                type: "Quan trọng A: " + calculatePercentage(totalHoursQuanTrongA, this.data.totalHoursInWeek) + "% - " + totalHoursQuanTrongA + " giờ",
              },
              {
                value: totalHoursQuanTrongB,
                type: "Quan trọng B: " + calculatePercentage(totalHoursQuanTrongB, this.data.totalHoursInWeek) + "% - " + totalHoursQuanTrongB + " giờ",
              },
              {
                value: totalHoursQuanTrongC,
                type: "Quan trọng C: " + calculatePercentage(totalHoursQuanTrongC, this.data.totalHoursInWeek) + "% - " + totalHoursQuanTrongC + " giờ",
              },
              {
                value: distance,
                type: "Thiếu: " + calculatePercentage(distance, this.data.totalHoursInWeek) + "% - " + distance + " giờ",
              },
            ];
          } else {
            let test = totalHours - distance;
            // Trường hợp dư giờ
            spec3.data[0].values = [
              {
                value: totalHours1,
                type: "Cấp bách 1: " + calculatePercentage(totalHours1, test) + "% - " + totalHours1 + " giờ",
              },
              {
                value: totalHours2,
                type: "Cấp bách 2: " + calculatePercentage(totalHours2, test) + "% - " + totalHours2 + " giờ",
              },
              {
                value: totalHours3,
                type: "Cấp bách 3: " + calculatePercentage(totalHours3, test) + "% - " + totalHours3 + " giờ",
              },
              {
                value: -distance,
                type: "Dư: " + calculatePercentage(-distance, test) + "% - " + -distance + " giờ",
              },
            ];
            spec2.data[0].values = [
              {
                value: totalHoursQuanTrongA,
                type: "Quan trọng A: " + calculatePercentage(totalHoursQuanTrongA, test) + "% - " + totalHoursQuanTrongA + " giờ",
              },
              {
                value: totalHoursQuanTrongB,
                type: "Quan trọng B: " + calculatePercentage(totalHoursQuanTrongB, test) + "% - " + totalHoursQuanTrongB + " giờ",
              },
              {
                value: totalHoursQuanTrongC,
                type: "Quan trọng C: " + calculatePercentage(totalHoursQuanTrongC, test) + "% - " + totalHoursQuanTrongC + " giờ",
              },
              {
                value: -distance,
                type: "Dư: " + calculatePercentage(-distance, test) + "% - " + -distance + " giờ",
              },
            ];
          }
          // Calculate total values for percentage calculation
          const totalTheLoai = data?.length || 0;

          let spec4 = this.data.spec4;
          spec4.data[0].values = [
            {
              value:
                data.filter(
                  (item) => item.fields["Thể loại"] == "Việc chính"
                )?.length || 0,
              type: "Việc chính",
            },
            {
              value:
                data.filter(
                  (item) => item.fields["Thể loại"] == "Việc phát sinh"
                )?.length || 0,
              type: "Việc phát sinh",
            },
            {
              value:
                data.filter(
                  (item) => item.fields["Thể loại"] == "Việc cần đôn đốc"
                )?.length || 0,
              type: "Việc cần đôn đốc",
            },
            {
              value:
                data.filter(
                  (item) => item.fields["Thể loại"] == "Đọc & học"
                )?.length || 0,
              type: "Đọc & học",
            },
            {
              value:
                data.filter(
                  (item) => item.fields["Thể loại"] == "Dự án"
                )?.length || 0,
              type: "Dự án",
            },
          ];

          // Add percentage to each value
          spec4.data[0].values = spec4.data[0].values.map((item) => {
            const percentage = ((item.value / totalTheLoai) * 100).toFixed(0);
            item.type = `${item.type}: ${percentage}% - ${item.value}`;
            return item;
          });

          let percentA, percentB, percentC;
          let assessmentA, assessmentB, assessmentC;
          let percent1, percent2, percent3;
          let assessment1, assessment2, assessment3;
          let distance1, percentdistance;

          if (distance >= 0) {
            percentA = ((totalHoursQuanTrongA / totalHours) * 100).toFixed(0);
            percentB = ((totalHoursQuanTrongB / totalHours) * 100).toFixed(0);
            percentC = ((totalHoursQuanTrongC / totalHours) * 100).toFixed(0);
            assessmentA = percentA > 65 ? "Tốt" : "Chưa tốt";
            assessmentB = percentB < 30 ? "Tốt" : "Chưa tốt";
            assessmentC = percentC >= 5 && percentC <= 10 ? "Tốt" : "Chưa tốt";

            percent1 = ((totalHours1 / totalHours) * 100).toFixed(0);
            percent2 = ((totalHours2 / totalHours) * 100).toFixed(0);
            percent3 = ((totalHours3 / totalHours) * 100).toFixed(0);

            assessment1 = percent1 > 65 ? "Tốt" : "Chưa tốt";
            assessment2 = percent2 < 30 ? "Tốt" : "Chưa tốt";
            assessment3 = percent3 >= 5 && percent3 <= 10 ? "Tốt" : "Chưa tốt";
            distance1 = ((distance / totalHours) * 100).toFixed(0);
            percentdistance =
              this.data.totalHoursInWeek >= totalHours &&
                ((distance / this.data.totalHoursInWeek) * 100).toFixed(0) < 10
                ? "Tốt"
                : "Chưa tốt";
          } else {
            let test = totalHours - distance;
            percentA = (
              (totalHoursQuanTrongA / test) *
              100
            ).toFixed(0);
            percentB = (
              (totalHoursQuanTrongB / test) *
              100
            ).toFixed(0);
            percentC = (
              (totalHoursQuanTrongC / test) *
              100
            ).toFixed(0);
            assessmentA = percentA > 65 ? "Tốt" : "Chưa tốt";
            assessmentB = percentB < 30 ? "Tốt" : "Chưa tốt";
            assessmentC = percentC >= 5 && percentC <= 10 ? "Tốt" : "Chưa tốt";

            percent1 = (
              (totalHours1 / test) *
              100
            ).toFixed(0);
            percent2 = (
              (totalHours2 / test) *
              100
            ).toFixed(0);
            percent3 = (
              (totalHours3 / test) *
              100
            ).toFixed(0);

            assessment1 = percent1 > 65 ? "Tốt" : "Chưa tốt";
            assessment2 = percent2 < 30 ? "Tốt" : "Chưa tốt";
            assessment3 = percent3 >= 5 && percent3 <= 10 ? "Tốt" : "Chưa tốt";
            distance1 = (
              (-distance / test) *
              100
            ).toFixed(0);
            percentdistance =
            totalHours >= test &&
                ((-distance / test) * 100).toFixed(0) < 10
                ? "Tốt"
                : "Chưa tốt";
          }
          let percentdistanceClass =
            percentdistance === "Tốt" ? "tot" : "chuatot";
          // Gán kết quả vào HTML với màu sắc
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
            percentdistance,
            totalHours,
            percentdistanceClass,
          });
          tt.showToast({
            title: "tải thành công !",
            icon: "success",
          });
        });
      },
    });
  },
  reloadDashboard: function () {
    this.getValueRecord();
  },
});
