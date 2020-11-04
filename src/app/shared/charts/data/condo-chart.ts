export const chartsType = {
    area : {
        chart: {
          // width: 380,
          type: 'pie',
          fontFamily: 'Prompt',
        },
        legend: {
          position: 'bottom'
        },
        colors: ['#81894E', '#0060be', '#FF0000', '#feb019', '#00be6b', '#6B77E1',  '#81894E'],
        // tslint:disable-next-line: max-line-length
        labels: ['พื้นที่ปกคลุม', 'พื้นที่รวมห้องพัก อาคาร 1', 'พื้นที่รวมห้องพัก อาคาร 2', 'พื้นที่รวมส่วนกลาง', 'พื้นที่รวมทางเดิน', 'พื้นที่จอดรถในอาคาร', 'พื้นที่นอกอาคาร'],
        series: [2294, 568, 429.3, 308],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 250
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
    },
    product: {
        chart: {
            // width: 380,
            type: 'pie',
            fontFamily: 'Prompt',
        },
        colors: ['#0060be', '#FF0000', '#FFDA29', '#009499',  '#feb019', '#ff9d5c'],
        // tslint:disable-next-line: max-line-length
        labels: ['พื้นที่รวมห้องพัก อาคาร 1', 'พื้นที่รวมห้องพัก อาคาร 2', 'พื้นที่รวมส่วนกลาง', 'พื้นที่รวมทางเดิน', 'พื้นที่จอดรถในอาคาร', 'พื้นที่ภายนอกอาคารไม่ได้คำนวณ'],
        series: [1, 0, 0],
        legend: {
                    position: 'bottom'
                },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 250
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    },
    productCom: {
      chart: {
          // width: 380,
          type: 'pie',
          fontFamily: 'Prompt',
      },
      colors: ['#FF6600', '#FF0000', '#FFDA29', '#009499',  '#feb019', '#81894E'],
      // tslint:disable-next-line: max-line-length
      labels: ['พื้นที่รวมห้องพัก อาคาร 1', 'พื้นที่รวมห้องพัก อาคาร 2', 'พื้นที่รวมส่วนกลาง', 'พื้นที่รวมทางเดิน', 'พื้นที่จอดรถในอาคาร', 'พื้นที่ภายนอกอาคารไม่ได้คำนวณ'],
      series: [1, 0, 0, 0, 0],
      legend: {
                  position: 'bottom'
              },
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 320
              },
              legend: {
                  position: 'bottom'
              }
          }
      }]
    },
    spendings: {
        chart: {
            // width: 380,
            type: 'pie',
            fontFamily: 'Prompt',
        },
        colors: [ '#feb019', '#00be6b', '#6B77E1'], // '#0060be',
        labels: [ 'Special Equipment + Pre Opening', 'ค่าใช้จ่ายรายเดือน', 'ค่าก่อสร้าง'], // "ค่าที่ดินทั้งหมด",
        series: [1, 0, 0],
        legend: {
                    position: 'bottom'
                },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 250
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }
};
