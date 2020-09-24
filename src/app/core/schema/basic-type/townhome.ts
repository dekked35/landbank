export const townhome = {
    "area": {
        "townPlanColor": "",
        "farValue": 3,
        "osrValue": 10,
        "totalArea": 10000,
        "availableArea": 5000,
        "landPrice": 250000,
        "fenceLength": 0,

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
                "sellArea": 64.22,
                "roadSize": 25,
                "greenArea": 10,
                "centerArea": 0.78,
            },
            "area": {
                "sellArea": 6422.875,
                "roadSize": 2500,
                "greenArea": 1000 ,
                "centerArea": 78.125,
            },
            "centerArea" : {
              "swimming" : 31.25,
              "fitnessZone" : 31.25,
              "officeZone" : 15.625,
            }
        },
        "ratio_area": {
            "sellArea": 64.22,
            "roadSize": 25,
            "greenArea": 10,
            "centerArea" : 0.78,
        },

        "costLand" : 200000000,
        "costLandType" : "", // not support
        "deposit": 0,
        "rentPerMonth" : 0,
        "rentNoYear" : 0,
    },
    "product": {
        "competitor": {
          "products": [
            {
                "type": "อาคารพานิชย์ 2 ชั้น",
                "area": 60.0,
                "stairArea": 13.2,
                "cost": 1.5,
                "ratio": 50,
                "quantity": 0,
                "size" : 21,
            },
            {
                "type": "อาคารพานิชย์ 3 ชั้น",
                "area": 66.0,
                "stairArea": 13.2,
                "cost": 2,
                "ratio": 30,
                "quantity": 0,
                "size" : 26.25,
            },
            {
                "type": "อาคารพานิชย์ 4 ชั้น",
                "area": 72.0,
                "stairArea": 13.2,
                "cost": 2.5,
                "ratio": 20,
                "quantity": 0,
                "size" : 31.5,
            }
        ],
            "depth": 12,
            "width": 5,
            "frontDepth": 6,
            "behindDepth": 3,
            "centralArea": 60, // พื้นที่ใช้สอย ตรงกลาง
            "fontArea": 30, // พื้นที่ด้านหน้า
            "behindArea": 15, // พื้นที่ด้านหลัง
            "totalAreaMeter": 60, // พื้นที่รวมตารางเมตร
            "totalAreaSquare": 60, // พื้นที่รวมตารางวา

            "totalQuantity": 0,
            "totalCost": 0.0,
            "usedArea": 0,
            "remainingArea": 0
        },
        "user": {
            "products": [
                {
                    "type": "อาคารพานิชย์ 2 ชั้น",
                    "area": 60.0,
                    "stairArea": 10,
                    "cost": 1.5,
                    "ratio": 50,
                    "quantity": 0,
                    "size" : 21,
                },
                {
                    "type": "อาคารพานิชย์ 3 ชั้น",
                    "area": 60.0,
                    "stairArea": 15,
                    "cost": 2,
                    "ratio": 30,
                    "quantity": 0,
                    "size" : 26.25,
                },
                {
                    "type": "อาคารพานิชย์ 4 ชั้น",
                    "area": 60.0,
                    "stairArea": 20,
                    "cost": 2.5,
                    "ratio": 20,
                    "quantity": 0,
                    "size" : 31.5,
                }
            ],

            "depth": 12,
            "width": 5,
            "frontDepth": 6,
            "behindDepth": 3,
            "centralArea": 60, // พื้นที่ใช้สอย ตรงกลาง
            "fontArea": 30, // พื้นที่ด้านหน้า
            "behindArea": 15, // พื้นที่ด้านหลัง
            "totalAreaMeter": 60, // พื้นที่รวมตารางเมตร
            "totalAreaSquare": 60, // พื้นที่รวมตารางวา

            "totalQuantity": 0,
            "totalCost": 0.0,

            "usedArea": 0,
            "remainingArea": 0
        }
    },
    "spendings": {
        "priceLandBought": 2500000000,
        "costConstructionLivingSpace": 10000,
        "costOther": 100000,
        "costPlan": 300000,
        "costDevelopRoad": 0.0,
        "costRoadCover": 0.0,
        "costTapWater": 0.0,
        "costWaterTreatment": 0.0,
        "costElectricity": 0.0,
        "costFenceAndGuardHouse": 0.0,
        "costDevelopGreenArea": 0.0,
        "costDevelopLand": 0.0,
        "costDevelopDone": 0.0,
        "costConstruction": 0.0,
        "costConstructionPerItem": [
            {
                "type": "อาคารพาณิชย์ 2 ชั้น",
                "costPerItem": 0.0,
                "quantity": 0.0,
                "total": 0.0
            },
            {
                "type": "อาคารพาณิชย์ 3 ชั้น",
                "costPerItem": 0.0,
                "quantity": 0.0,
                "total": 0.0
            },
            {
                "type": "อาคารพาณิชย์ 4 ชั้น",
                "costPerItem": 0.0,
                "quantity": 0.0,
                "total": 0.0
            }
        ],
        "costInProject": 0.0,
        "periodSellStart": '01/01/2020',
        "periodSellEnd": '12/31/2022',
        "sellPeriod": 36,
        "noEmployee": 5,
        "totalSalary": 0.0,
        "salaryEmployee": 15000,
        'costAdvt': 100000,
        'costCommission': 10000,
        "percentCostAdvt": 1,
    },
    "implicitCosts": {
        "sellAreaSize": 0.00,
        "costLand": 0.00,
        "costAdvtAndEmployee": 0.00,
        "costAll": 0.00,
        "costProject": 0.00
    },
    "profit": {
        "profitPerItems": [
            {
                "type": "อาคารพาณิชย์ 2 ชั้น",
                "profitPerItem": 0.0,
                "noItem": 0.0,
                "totalProfit": 0.0
            },
            {
                "type": "อาคารพาณิชย์ 3 ชั้น",
                "profitPerItem": 0.0,
                "noItem": 0.0,
                "totalProfit": 0.0
            },
            {
                "type": "อาคารพาณิชย์ 4 ชั้น",
                "profitPerItem": 0.0,
                "noItem": 0.0,
                "totalProfit": 0.0
            }
        ],
        "totalProfit": 0.0,
        "netProfit": 0.0,
        "averageProfitPerHouse": 0.0
    },
    "rateReturn" : {
        "investmentBudget" : 0.0, // งบลงทุน
        "incomePerMonth" : 0.0,   // รายได้ต่อเดือนสุทธิ
        "expensePerMonth" : 0.0, // รายรับต่อเดือน

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
        "financeCosts" : 0.0, // ต้นทุนทางการเงิน
        "paybackPeriod" : 0.0, // ต้นทุนทางการเงิน
        "investmentValue" : 0.0, // จำนวน มูลค่าเงินลงทุน
        "ratioInvestmentValue" : 100, // สัดส่วน มูลค่าเงินลงทุน
        "privateFund" : 0.0, // จำนวน ส่วนทุน
        "ratioPrivateFund" : 0.0, // สัดส่วน ส่วนทุน
        "interestPrivateFund" : 0.0, // ดอกเบี้ย ส่วนทุน
        "borrowFund" : 0.0, // จำนวน ส่วนเงินกู้
        "ratioBorrowFund" : 0.0, // สัดส่วน ส่วนเงินกู้
        "interestBorrowFund" : 0.0, // ดอกเบี้ย ส่วนเงินกู้
        "borrowPeriod" : 4, // ระยะเวลากู้ธนาคาร
    }
}
