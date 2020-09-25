export const standardSizes = {
    'village' : {
      'village' : [
        {type : 'ที่ดิน', size: 'ขนาด (ตร.ว.)', area: 'พื้นที่ใช้สอย (ตร.ม.)' },
        {type : 'บ้าน 1 ชั้น', size: '50', area: '110' },
        {type : 'บ้าน 2 ชั้น', size: '60', area: '180' },
        {type : 'บ้าน 3 ชั้น', size: '70', area: '200' },
      ]
    },
    'townhome' : {
      'village' : [
        {type : 'ที่ดิน', size: 'พื้นที่ใช้สอย (ตร.ม.)', area: 'พื้นที่บันได (ตร.ม.)', price: 'ราคาขาย (ล้านบาท)' },
        {type : 'อาคารพาณิชย์ 2 ชั้น', size: '60', area: '13.2', price: '1.5' },
        {type : 'อาคารพาณิชย์ 4 ชั้น', size: '66', area: '13.2', price: '2' },
        {type : 'อาคารพาณิชย์ 3 ชั้น', size: '72', area: '13.2', price: '2.5' },
      ],
      'product' : [
        {type : 'ความกว้าง (ม.)', size: 'ความลึก (ม.)', area: 'ความลึกที่จอดรถด้านหน้า (ม.)', price: 'ความลึกที่ซักล้างด้านหลัง (ม.)' },
        {type : '5', size: '12', area: '6', price: '3' },
        {type : '5.5', size: '12', area: '7', price: '4' },
        {type : '6', size: '12', area: '8', price: '5' },
      ]
    },
    'condo' : {
        'room' : [
            {name: 'Pool Villa', type: 'ห้องพัก', unit: 'ตร.ม.', size: 65},
            {name: 'Jacuzzi Villa', type: 'ห้องพัก', unit: 'ตร.ม.', size: 65},
            {name: 'Family Room', type: 'ห้องพัก', unit: 'ตร.ม.', size: 45},
            {name: 'Super deluxe', type: 'ห้องพัก', unit: 'ตร.ม.', size: 30},
            {name: 'Deluxe',  type: 'ห้องพัก', unit: 'ตร.ม.', size: 30},
          ],
        'central' : [
            {name: 'Lobby', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 150},
            {name: 'Pool',  type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'BOH & Store', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 150},
            {name: 'Restaurant', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 120},
            {name: 'Spa', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60},
            {name: 'Gym',  type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'Kitchen', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'Kid Club', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60},
            {name: 'Restroom', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60}
          ],
        'parking' : [
            {name: 'Carpark 1', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 20},
            {name: 'Carpark 2', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 40}
          ],
        'outdoor' : [
            {name: 'Garden', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 60},
            {name: 'Entrance Gate', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 10},
            {name: 'Entrance Fence', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 20}
          ]
    },
    'hotel' : {
        'room' : [
            {name: 'ห้องพัก', type: 'ห้องพัก', unit: 'หน่วย', size: 'ขนาด'},
            {name: '1 Bedroom', type: 'ห้องพัก', unit: 'ตร.ม.', size: 32},
            {name: '2 Bedroom', type: 'ห้องพัก', unit: 'ตร.ม.', size: 35},
            {name: '3 Bedroom', type: 'ห้องพัก', unit: 'ตร.ม.', size: 55},
          ],
        'central' : [
            {name: 'ส่วนกลาง', type: 'ส่วนกลาง', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Lobby', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 150},
            {name: 'Pool',  type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'BOH & Store', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 150},
            {name: 'Restaurant', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 120},
            {name: 'Spa', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60},
            {name: 'Gym',  type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'Kitchen', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 50},
            {name: 'Kid Club', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60},
            {name: 'Restroom', type: 'ส่วนกลาง', unit: 'ตร.ม.', size: 60}
          ],
        'parking' : [
            {name: 'ที่จอดรถ', type: 'ที่จอดรถ', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Carpark 1', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 20},
            {name: 'Carpark 2', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 40}
          ],
        'outdoor' : [
            {name: 'พื้นที่ภายนอก', type: 'พื้นที่ภายนอก', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Garden', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 60},
            {name: 'Entrance Gate', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 10},
            {name: 'Entrance Fence', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 20}
          ],
        'resort' : [
            {name: 'ห้องพัก', type: 'ห้องพัก', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Pool Villa', type: 'ห้องพัก', unit: 'ตร.ม.', size: 65},
            {name: 'Family Room', type: 'ห้องพัก', unit: 'ตร.ม.', size: 45},
            {name: 'Jacuzzi Villa', type: 'ห้องพัก', unit: 'ตร.ม.', size: 65},
            // {name: 'Super deluxe', type: 'ห้องพัก', unit: 'ตร.ม.', size: 30},
            // {name: 'Deluxe',  type: 'ห้องพัก', unit: 'ตร.ม.', size: 30},
        ]
    },
    'communityMall' : {
        'room' : [
            {name: 'พื้นที่ให้เช่า', type: 'ห้องพัก', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Store Booth', type: 'ห้องพัก', unit: 'ตร.ม.', size: 50 },
            {name: 'Small Store', type: 'ห้องพัก', unit: 'ตร.ม.', size: 10 },
            {name: 'Restaurant', type: 'ห้องพัก', unit: 'ตร.ม.', size: 60 },
            {name: 'IT Store', type: 'ห้องพัก', unit: 'ตร.ม.', size: 30 },
            {name: 'Electronics Store', type: 'ห้องพัก', unit: 'ตร.ม.', size: 40 },
            {name: 'Gym', type: 'ห้องพัก', unit: 'ตร.ม.', size: 90 },
            {name: 'Spa', type: 'ห้องพัก', unit: 'ตร.ม.', size: 60 },
            {name: 'Cinema', type: 'ห้องพัก', unit: 'ตร.ม.', size: 120 },
            {name: 'Food Court', type: 'ห้องพัก', unit: 'ตร.ม.', size: 100 },
            {name: 'General Store', type: 'ห้องพัก', unit: 'ตร.ม.', size: 50 },
            {name: 'Learning Store', type: 'ห้องพัก', unit: 'ตร.ม.', size: 60 },
        ],
        'central' : [
            {name: 'พื้นที่ส่วนกลาง', type: 'พื้นที่ส่วนกลาง', unit: 'หน่วย', size: 'ขนาด'},
            {name: 'Restaurant', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 60 },
            {name: 'IT Store', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 30 },
            {name: 'Gym', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 90 },
            {name: 'Spa', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 60 },
            {name: 'Cinema', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 120 },
            {name: 'Food Court', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 100 },
            {name: 'General Store', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 50 },
            {name: 'Learning Store', type: 'พื้นที่ส่วนกลาง', unit: 'ตร.ม.', size: 60 },
        ],
        'parking' : [
          {name: 'ที่จอดรถ', type: 'ที่จอดรถ', unit: 'หน่วย', size: 'ขนาด'},
          {name: 'Carpark 1', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 20},
          {name: 'Carpark 2', type: 'ที่จอดรถ', unit: 'ตร.ม.', size: 40}
        ],
        'outdoor' : [
          {name: 'พื้นที่ภายนอก', type: 'พื้นที่ภายนอก', unit: 'หน่วย', size: 'ขนาด'},
          {name: 'Garden', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 50},
          {name: 'Entrance Gate', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 10},
          {name: 'Entrance Fence', type: 'พื้นที่ภายนอก', unit: 'ตร.ม.', size: 20}
        ],
    },
    'resort' : {
      'resort' : [
        {type : 'ที่ดิน', size: 'ขนาด (ตร.ว.)', area: 'พื้นที่ใช้สอย (ตร.ม.)' },
        {type : 'บ้าน 1 ชั้น', size: '50', area: '110' },
        {type : 'บ้าน 2 ชั้น', size: '60', area: '180' },
        {type : 'บ้าน 3 ชั้น', size: '70', area: '200' },
      ]
    },
}
