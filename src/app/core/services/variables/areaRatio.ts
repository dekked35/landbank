export const areaRatioList = [
  {
      propertyType : ["village"],
      areaRatio : [
          {
            id: 1,
            name: 'แบบที่ 1'
          },
          {
            id: 2,
            name: 'แบบที่ 2'
          },
          {
            id: 3,
            name: 'แบบที่ 3'
          },
          {
            id: 4,
            name: 'กำหนดเอง'
          }
        ]
  },
  {
    propertyType : ["townhome"],
    areaRatio : [
      {
        id: 1,
        name: 'แบบที่ 1 ติดถนนใหญ่'
      },
      {
        id: 2,
        name: 'แบบที่ 2'
      },
      {
        id: 3,
        name: 'แบบที่ 3'
      },
      {
        id: 4,
        name: 'กำหนดเอง'
      }
    ]
  },
  {
      propertyType : ["condo","hotel","communityMall","resort"],
      areaRatio : [
          {
            id: 1,
            name: 'แบบที่ 1'
          },
          {
            id: 2,
            name: 'แบบที่ 2'
          },
          {
            id: 3,
            name: 'แบบที่ 3'
          },
          {
            id: 4,
            name: 'กำหนดเอง'
          }
        ]
  }
]

export const areaUnitList = [
{
    propertyType : ["village"],
    areaRatio : [
        {
          id: 1,
          name: 'แบบที่ 1',
          score: {
            beauty: 'มาก',
            density: 'ปานกลาง',
            congestion: 'ปานกลาง',
            convenientArea: 'น้อย',
            centerArea: 'น้อย'
          },
          percent: {
            sellArea: 64.21875,
            roadSize: 25,
            greenArea: 10,
            centerArea: 0.78125,
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0,
            centerArea: 0,
          },
          centerArea : {
            swimming : 100,
            fitnessZone : 100,
            officeZone : 50,
          }
        },
        {
          id: 2,
          name: 'แบบที่ 2',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'ปานกลาง',
            convenientArea: 'ปานกลาง',
            centerArea: 'น้อย'
          },
          percent: {
            sellArea: 59.21875,
            roadSize: 25,
            greenArea: 15,
            centerArea: 0.78125
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0,
            centerArea: 0,
          },
          centerArea : {
            swimming : 100,
            fitnessZone : 100,
            officeZone : 50,
          }
        },
        {
          id: 3,
          name: 'แบบที่ 3',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'น้อย',
            convenientArea: 'มาก',
            centerArea: 'น้อย'
          },
          percent: {
            sellArea: 49.21875,
            roadSize: 25,
            greenArea: 25,
            centerArea: 0.78125
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0,
            centerArea: 0,
          },
          centerArea : {
            swimming : 100,
            fitnessZone : 100,
            officeZone : 50,
          }
        },
        {
          id: 4,
          name: 'กำหนดเอง',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'น้อย',
            convenientArea: 'มาก',
            centerArea: 'น้อย'
          },
          percent: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0,
            centerArea: 0,
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0,
            centerArea: 0,
          },
          centerArea : {
            swimming : 0,
            fitnessZone : 0,
            officeZone : 0,
          }
        }
      ]
},
{
  propertyType : ["townhome"],
  areaRatio : [
      {
        id: 1,
        name: 'แบบที่ติดถนนใหญ่',
        score: {
          beauty: 'มาก',
          density: 'ปานกลาง',
          congestion: 'ปานกลาง',
          convenientArea: 'น้อย',
          centerArea: 'น้อย'
        },
        percent: {
          sellArea: 100,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        area: {
          sellArea: 0,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        centerArea : {
          swimming : 0,
          fitnessZone : 0,
          officeZone : 0,
        }
      },
      {
        id: 2,
        name: 'แบบที่ 2',
        score: {
          beauty: 'ปานกลาง',
          density: 'น้อย',
          congestion: 'ปานกลาง',
          convenientArea: 'ปานกลาง',
          centerArea: 'น้อย'
        },
        percent: {
          sellArea: 59.21875,
          roadSize: 25,
          greenArea: 15,
          centerArea: 0.78125
        },
        area: {
          sellArea: 0,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        centerArea : {
          swimming : 100,
          fitnessZone : 100,
          officeZone : 50,
        }
      },
      {
        id: 3,
        name: 'แบบที่ 3',
        score: {
          beauty: 'ปานกลาง',
          density: 'น้อย',
          congestion: 'น้อย',
          convenientArea: 'มาก',
          centerArea: 'น้อย'
        },
        percent: {
          sellArea: 49.21875,
          roadSize: 25,
          greenArea: 25,
          centerArea: 0.78125
        },
        area: {
          sellArea: 0,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        centerArea : {
          swimming : 100,
          fitnessZone : 100,
          officeZone : 50,
        }
      },
      {
        id: 4,
        name: 'กำหนดเอง',
        score: {
          beauty: 'ปานกลาง',
          density: 'น้อย',
          congestion: 'น้อย',
          convenientArea: 'มาก',
          centerArea: 'น้อย'
        },
        percent: {
          sellArea: 0,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        area: {
          sellArea: 0,
          roadSize: 0,
          greenArea: 0,
          centerArea: 0,
        },
        centerArea : {
          swimming : 0,
          fitnessZone : 0,
          officeZone : 0,
        }
      }
    ]
},
{
    propertyType : ["condo","hotel","communityMall"],
    areaRatio : [
        {
          id: 1,
          name: 'แบบที่ 1',
          score: {
            beauty: 'มาก',
            density: 'ปานกลาง',
            congestion: 'ปานกลาง',
            convenientArea: 'น้อย'
          },
          percent: {
            room: 75,
            central: 15,
            corridor: 0,
            parking: 5,
            outdoor: 5,
            resort: 0
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0,
            resort: 0
          }
        },
        {
          id: 2,
          name: 'แบบที่ 2',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'ปานกลาง',
            convenientArea: 'ปานกลาง'
          },
          percent: {
            room: 60,
            central: 20,
            corridor: 0,
            parking: 10,
            outdoor: 10,
            resort: 0
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0,
            resort: 0
          }
        },
        {
          id: 3,
          name: 'แบบที่ 3',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'น้อย',
            convenientArea: 'มาก'
          },
          percent: {
            room: 50,
            central: 30,
            corridor: 0,
            parking: 10,
            outdoor: 10,
            resort: 0
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0,
            resort: 0
          }
        },
        {
          id: 4,
          name: 'กำหนดเอง',
          score: {
            beauty: 'ปานกลาง',
            density: 'น้อย',
            congestion: 'น้อย',
            convenientArea: 'มาก'
          },
          percent: {
            room: 50,
            central: 30,
            corridor: 0,
            parking: 10,
            outdoor: 10,
            resort: 0
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0,
            resort: 0
          }
        }
      ]
}]
