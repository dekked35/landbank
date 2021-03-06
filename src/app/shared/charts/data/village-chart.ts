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
        colors: ['#81894E', '#0060be', '#feb019', '#00be6b', '#FF0000'],
        labels: ['พื้นที่ปกคลุม', 'พื้นที่ขาย', 'ถนน', 'พื้นที่สีเขียว', 'พื่นที่ส่วนกลาง'],
        series: [1, 1, 1],
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
        colors: ['#0060be', '#094575', '#133d55'],
        labels: ['บ้าน 1 ชั้น', 'บ้าน 2 ชั้น', 'บ้าน 3 ชั้น'],
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
      colors: ['#ff6600', '#ff781f', '#ff8b3d'],
      labels: ['บ้าน 1 ชั้น', 'บ้าน 2 ชั้น', 'บ้าน 3 ชั้น'],
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
    spendings: {
        chart: {
            // width: 380,
            type: 'pie',
            fontFamily: 'Prompt',
        },
        colors: ['#0060be', '#094575', '#133d55'],
        labels: ['สาธารณูปโภค', 'ค่าพัฒนาถนน', 'พื้นที่สีเขียว'],
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
