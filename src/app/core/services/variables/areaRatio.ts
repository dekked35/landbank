export const areaRatioList = [
  {
      propertyType : ["village","townhome"],
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
      propertyType : ["condo","hotel","communityMall"],
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
    propertyType : ["village","townhome"],
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
            sellArea: 65,
            roadSize: 25,
            greenArea: 10
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0
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
            sellArea: 60,
            roadSize: 25,
            greenArea: 15
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0
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
            sellArea: 50,
            roadSize: 25,
            greenArea: 25
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0
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
            sellArea: 0,
            roadSize: 0,
            greenArea: 0
          },
          area: {
            sellArea: 0,
            roadSize: 0,
            greenArea: 0
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
            outdoor: 5
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0
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
            outdoor: 10
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0
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
            outdoor: 10
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0
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
            outdoor: 10
          },
          area: {
            room: 0,
            central: 0,
            corridor: 0,
            parking: 0,
            outdoor: 0
          }
        }
      ]
}
]
