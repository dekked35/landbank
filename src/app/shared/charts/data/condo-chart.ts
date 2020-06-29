export const chartsType = {
    area : {
        chart: {
          // width: 380,
          type: 'pie',
          fontFamily: "Prompt",
        },
        legend: {
          position: 'bottom'
        },
        colors: ['#0060be', '#feb019', '#00be6b'],
        labels: ['พื้นที่รวมห้องพัก', 'พื้นที่รวมส่วนกลาง', 'พื้นที่รวมทางเดิน','พื้นที่จอดรถในอาคาร'],
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
            //width: 380,
            type: 'pie',
            fontFamily: "Prompt",
        },
        colors:['#0060be', '#094575', '#133d55'],
        labels: ["บ้าน 1 ชั้น", "บ้าน 2 ชั้น", "บ้าน 3 ชั้น"],
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
            //width: 380,
            type: 'pie',
            fontFamily: "Prompt",
        },
        colors:[ '#feb019', '#00be6b', '#6B77E1'], // '#0060be',
        labels: [ "Special Equipment + Pre Opening", "ค่าใช้จ่ายรายเดือน", "ค่าก่อสร้าง"], // "ค่าที่ดินทั้งหมด",
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
}