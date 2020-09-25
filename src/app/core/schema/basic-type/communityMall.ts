export const communityMall = {
    "area": {
        "townPlanColor": "",
        "farValue" : 3,
        "osrValue": 10,
        "totalArea": 5000,
        "availableArea" : 5000,  // พื้นที่ที่ใช้ได้ตามกฏหมาย คำนวณตามสูตร ขนาดพื้นที่ (ตร.ว.) × 4 × ค่า Far = พื้นที่ใช้สอยของอาคาร ที่สามารถก่อสร้างได้ (ตร.ม.)
        "landPrice": 250000,   // ดึงจาก API
        "standardArea": {
            "id": 1,
            "name": 'แบบที่ 1',
            "score": {
                "beauty": 'มาก',
                "density": 'ปานกลาง',
                "congestion": 'ปานกลาง',
                "convenientArea": 'น้อย'
            },
            "percent": {
                "room": 75,
                "central": 15,
                "corridor": 10,
                "parking": 5,
                "outdoor": 5
            },
            "area": {
                "room": 0,
                // "central": 0,
                "corridor": 0,
                "parking": 0,
                "outdoor": 0
            }
        },
        "ratio_area" : {
            "room": 0,
            "central": 0,
            "corridor": 0,
            "parking": 0,
            "outdoor": 0
        },

        "costLand" : 0,
        "costLandType" : "buy", // "rent" , "buy", ""
        "deposit": 500000, //เงินมัดจำ
        "rentPerMonth" : 100000, // ค่าเช่าต่อเดือน
        "rentNoYear" : 10, // ค่าเช่าต่อปี
    },
    "product": {
        "competitor": {
            "rooms": [],
            "totalRoomArea": 0,
            "roomCorridor": 0,
            "centrals": [],
            "totalCentralArea": 0,
            "centralCorridor": 0,
            "parking": [],
            "roadArea": 0,
            "outdoors": [],
            "availableArea": 0,
            "usedArea": 0,
            "totalCorridor": 0,
            "totalParkingArea": 0,
            "totalOutdoorArea": 0,
            "totalRoomQuantity": 0,
            "remainingArea": 0
        },
        "user" : {
            "rooms" : [],
            "totalRoomArea": 0.0, // พื้นที่รวมห้องพัก
            "roomCorridor": 0.0, // พื้นที่รวมทางเดินส่วนกลาง 15% ของพื้นที่รวมห้องพัก
            "centrals" : [],
            "totalCentralArea": 0.0,  // พื้นที่รวมส่วนกลาง
            "centralCorridor": 0.0, // พื้นที่รวมทางเดินส่วนกลาง 20% ของพื้นที่รวมห้องพัก
            "parking" : [],
            "roadArea" : 0.0, // พื้นที่เสียจากถนนขับผ่าน 40%
            "outdoors" : [],
            "availableArea" : 0,  // พื้นที่ที่ใช้ได้ตามกฏหมาย คำนวณตามสูตร ขนาดพื้นที่ (ตร.ว.) × 4 × ค่า Far = พื้นที่ใช้สอยของอาคาร ที่สามารถก่อสร้างได้ (ตร.ม.)
            "usedArea" : 0.0, // พื้นทืที่ใช้ไป
            "totalCorridor" : 0.0,  // พื้นทืที่รวมทางเดิน
            "totalParkingArea" : 0.0,  // พื้นที่จอดรถในอาคาร
            "totalOutdoorArea" : 0.0,  // พื้นที่ภายนอกอาคารไม่ได้คำนวณ
            "totalRoomQuantity" : 0.0, // จำนวนห้องพักทั้งหมด
            "remainingArea" : 0.0 , // พื้นที่ว่างคงเหลือ
        }
    },
    "spendings": {
        "rooms" : [],
        "totalRoomCost" : 0.0, // ต้นทุนก่อสร้างห้องพักทั้งหมด
        "centrals" : [],
        "totalCentralCost" : 0.0, // ต้นทุนก่อสร้างพื้นที่ส่วนกลาง
        "parking" : [],
        "totalParkingCost" : 0.0, // ต้นทุนก่อสร้างพื้นที่จอดรถ
        "outdoors" : [],
        "totalOutDoorCost" : 0.0, // รวมต้นทุนก่อสร้างพื้นที่ภายนอก
        "costPerMonth" : [
            {
                "type" : "ค่าการตลาด",
                "cost" : 1000,
                "no" : 2,
                "total" : 0.0
            },
            {
                "type" : "พนักงานทำความสะอาด",
                "cost" : 15000,
                "no" : 5,
                "total" : 0.0
            },
            {
                "type" : "พนักงานทั่วไป",
                "cost" : 20000,
                "no" : 5,
                "total" : 0.0
            },
            {
                "type" : "ค่าใช้จ่ายของผู้เข้าพัก",
                "cost" : 300,
                "no" : 2,
                "total" : 0.0
            }
        ],
        "totalCostPerMonth" : 0.0, // รวมค่าใช้จ่ายรายเดือน
        "specialEquipments" : [
            {
                "type" : "ค่าลิฟต์",
                "cost" : 1000000,
                "no" : 2,
                "total" : 0.0
            },
            {
                "type" : "ห้อง IT",
                "cost" : 300000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่ารถยนต์",
                "cost" : 1000000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่าออกแบบ",
                "cost" : 1000000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "Restaurant",
                "cost" : 300000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่าอุปกรณ์ครัว",
                "cost" : 300000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่าอุปกรณ์ห้องพัก",
                "cost" : 100000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่าอุปกรณ์ส่วนต่าง ๆ",
                "cost" : 50000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "Contingency",
                "cost" : 1000000,
                "no" : 1,
                "total" : 0.0
            },
            {
                "type" : "ค่า Pre-Opening",
                "cost" : 0,
                "no" : 3,
                "total" : 0.0
            }
        ],


        "totalEquipmentsCost" : 0.0, // รวมค่าใช้จ่ายอุปกรณ์ทั้งหมด
        "totalCostPerMonthAndPreOpening" : 0.0, // รวมค่าใช้จ่ายรายเดือนและ Pre-Opening

        "costLand" : 0.0, // ค่าที่ดินทั้งหมด
        "costSpecielEquipmentAndPreOpening" : 0.0, // ค่าใช้จ่ายรายเดือน
        "costConstruction" : 0.0, // ค่าก่อสร้าง
        "absoluteCost" : 0.0 // มูลค่ารวมทั้งโครงการ
    },
    "implicitCosts" : {
        "sellAreaSize" :  0.0, // พื้นที่ใช้ขาย
        "costLand" :  0.0, // ต้นทุนที่ดิน
        "costAdvtAndEmployee" :  0.0, // ค่าการตลาดและพนักงาน
        "costAll" :  0.0, //  ต้นทุนทั้งหมด

        "occupancy" : 80,
        "incomes" : [
            {
                "type"  : "", // ชนิดของห้อง
                "name" : "", // ชื่อห้อง
                "area" : 0.0, // พื้นที่ใช้สอย
                "noRoom" : 0.0, // จำนวนห้อง
                "pricePerRoom" : 0, // Input, ค่าบริการต่อห้อง
                "incomePerDay" : 0 // รายได้ต่อวัน
            },
            {
                "type"  : "", // ชนิดของห้อง
                "name" : "", // ชื่อห้อง
                "area" : 0.0, // พื้นที่ใช้สอย
                "noRoom" : 0.0, // จำนวนห้อง
                "pricePerRoom" : 0, // Input, ค่าบริการต่อห้อง
                "incomePerDay" : 0 // รายได้ต่อวัน
            }
        ],
        "totalIncomePerDay" : 0.0,
        "totalIncomePerMonth" : 0.0,
        "estimatedIncomePerMonth" : 0.0,
        "totalIncomePerYear" : 0.0
    },
    "profit" : { // ยังไม่แน่นอน รอ confirm
        "profitPerItems" : [
            {
                "roomType"  : "", // ชนิดของห้อง
                "roomName" : "", // ชื่อห้อง
                "area" : 0.0, // พื้นที่ใช้สอย
                "noRoom" : 0.0, // จำนวนห้อง
                "profitPerRoom" : 0, // กำไรต่อห้อง
            },
            {
                "roomType"  : "", // ชนิดของห้อง
                "roomName" : "", // ชื่อห้อง
                "area" : 0.0, // พื้นที่ใช้สอย
                "noRoom" : 0.0, // จำนวนห้อง
                "profitPerRoom" : 0, // กำไรต่อห้อง
            },
            {
                "roomType"  : "", // ชนิดของห้อง
                "roomName" : "", // ชื่อห้อง
                "area" : 0.0, // พื้นที่ใช้สอย
                "noRoom" : 0.0, // จำนวนห้อง
                "profitPerRoom" : 0, // กำไรต่อห้อง
            }
        ],
        "totalProfitProject" : 0.0,
        "netProfitAfterLessCost" : 0.0,
        "averageProfitPerHouse" : 0.0
    },
    "rateReturn" : {
        "investmentBudget" : 0.0, // งบลงทุน
        "incomePerMonth" : 0.0,   // รายได้ต่อเดือนสุทธิ
        "breakEvenPointMonthCash" : 0.0, // จุดคุ้มทุนจำนวนเดือน
        "breakEvenPointYearCash" : 0.0, // จุดคุ้มทุนจำนวนปี

        "bankLoad" : 80, // สัดส่วนการกู้ธนาคาร
        "privateCash" : 20,  // สัดส่วนการเงินส่วนตัว
        "bankInterest" : 8, // อัตราดอกเบี้ย
        "returnRate" : 13, // อัตราผลการตอบแทนที่นักลงทุนต้องการ
        "breakEvenPointMonthBank" : 0.0, // จุดคุ้มทุนจำนวนเดือน
        "breakEvenPointYearBank" : 0.0, // จุดคุ้มทุนจำนวนปี
        "cashFlowYear" : 30, // งบกระแสเงินสด (จำนวนปี)

        "npvValue" : 0.0, // สัดส่วนการเงินส่วนตัว
        "irrValue" : 0.0,
        "financeCosts" : 0.0, // ต้นทุนทางการเงิน -> ลบออก
        "paybackPeriod" : 0.0, // ต้นทุนทางการเงิน

        "investmentValue" : 0.0, // จำนวน มูลค่าเงินลงทุน
        "ratioInvestmentValue" : 100, // สัดส่วน มูลค่าเงินลงทุน
        "privateFund" : 0.0, // จำนวน ส่วนทุน
        "ratioPrivateFund" : 0.0, // สัดส่วน ส่วนทุน  -> ลบออก
        "interestPrivateFund" : 0.0, // ดอกเบี้ย ส่วนทุน -> ลบออก
        "borrowFund" : 0.0, // จำนวน ส่วนเงินกู้
        "ratioBorrowFund" : 0.0, // สัดส่วน ส่วนเงินกู้ -> ลบออก
        "interestBorrowFund" : 0.0, // ดอกเบี้ย ส่วนเงินกู้ -> ลบออก
        "wacc" : 0.0, // ต้นทุนทางการเงินเฉลี่ย
        "borrowPeriod" : 4, // ระยะเวลากู้ธนาคาร
    }
}
