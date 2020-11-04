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
        labels: ['พื้นที่ปกคลุม', 'พื้นที่รวมห้องพัก', 'พื้นที่จอดรถในอาคาร', 'พื้นที่ภายนอกอาคาร', 'พื้นที่รวมส่วนกลาง'],
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
        labels: ['Pool Villa', 'Family Room', 'Jacuzzi Villa'],
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
