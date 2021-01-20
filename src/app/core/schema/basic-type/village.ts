export const village = {
    'area': {
        'townPlanColor': '',
        'farValue': 3,
        'osrValue': 10,
        'availableArea': 5000,
        'landPrice': 250000,
        'fenceLength': 0,
        'totalArea': 10000,

        'standardArea': {
            'id': 1,
            'name': 'แบบที่ 1',
            'score': {
                'beauty': 'มาก',
                'density': 'ปานกลาง',
                'congestion': 'ปานกลาง',
                'convenientArea': 'น้อย'
            },
            'percent': {
                'sellArea': 69,
                'roadSize': 25,
                'greenArea': 5,
                'centerArea': 1,
            },
            'area': {
                'sellArea': 6922,
                'roadSize': 2500,
                'greenArea': 500,
                'centerArea' : 78,
            },
            'centerArea' : {
              'swimming' : 100,
              'fitnessZone' : 100,
              'officeZone' : 50,
            }
        },
        'ratio_area': {
            'sellArea': 6922,
            'roadSize': 2500,
            'greenArea': 500,
            'centerArea' : 78,
        },
        'costLand' : 0,
        'costLandType' : '', // not support
        'deposit': 0,
        'rentPerMonth' : 0,
        'rentNoYear' : 0,

    },
    'product': {
        'competitor': {
            'products': [
                {
                    'type': 'บ้าน 1 ชั้น',
                    'size': 50,
                    'area': 100,
                    'cost': 10,
                    'ratio': 50,
                    'quantity': 0
                },
                {
                    'type': 'บ้าน 2 ชั้น',
                    'size': 100,
                    'area': 200,
                    'cost': 20,
                    'ratio': 25,
                    'quantity': 0
                },
                {
                    'type': 'บ้าน 3 ชั้น',
                    'size': 100,
                    'area': 300,
                    'cost': 30,
                    'ratio': 25,
                    'quantity': 0
                }
            ],
            'totalQuantity': 0,
            'totalCost': 0.0,
            'usedArea': 0,
            'remainingArea': 0
        },
        'user': {
          'products': [
              {
                  'type': 'บ้าน 1 ชั้น',
                  'size': 50,
                  'area': 100,
                  'cost': 10,
                  'ratio': 50,
                  'quantity': 0
              },
              {
                  'type': 'บ้าน 2 ชั้น',
                  'size': 100,
                  'area': 200,
                  'cost': 20,
                  'ratio': 25,
                  'quantity': 0
              },
              {
                  'type': 'บ้าน 3 ชั้น',
                  'size': 100,
                  'area': 300,
                  'cost': 30,
                  'ratio': 25,
                  'quantity': 0
              }
          ],
          'totalQuantity': 0,
          'totalCost': 0.0,
          'usedArea': 0,
          'remainingArea': 0
        }
    },
    'spendings': {
        'priceLandBought': 2500000000,
        'costConstructionLivingSpace': 10000,
        'costOther': 100000,
        'costPlan': 300000,
        'costDevelopRoad': 0.0,
        'costRoadCover': 0.0,
        'costTapWater': 0.0,
        'costWaterTreatment': 0.0,
        'costElectricity': 0.0,
        'costFenceAndGuardHouse': 0.0,
        'costDevelopGreenArea': 0.0,
        'costDevelopLand': 0.0,
        'costDevelopDone': 0.0,
        'costConstruction': 0.0,
        'costConstructionPerItem': [
            {
                'type': 'บ้าน 1 ชั้น',
                'costPerItem': 0.0,
                'quantity': 0.0,
                'total': 0.0
            },
            {
                'type': 'บ้าน 2 ชั้น',
                'costPerItem': 0.0,
                'quantity': 0.0,
                'total': 0.0
            },
            {
                'type': 'บ้าน 3 ชั้น',
                'costPerItem': 0.0,
                'quantity': 0.0,
                'total': 0.0
            }
        ],
        'costInProject': 0.0,
        'periodSellStart': '01/01/2020',
        'periodSellEnd': '12/31/2022',
        'sellPeriod': 36,
        'noEmployee': 5,
        'totalSalary': 0.0,
        'salaryEmployee': 15000,
        'costAdvt': 100000,
        'costCommission': 10000,
        'percentCostAdvt': 1,
    },
    'implicitCosts': {
        'sellAreaSize': 0.00,
        'costLand': 0.00,
        'costAdvtAndEmployee': 0.00,
        'costAll': 0.00,
        'costProject': 0.00
    },
    'profit': {
        'profitPerItems': [
            {
                'type': 'บ้าน 1 ชั้น',
                'profitPerItem': 0.0,
                'noItem': 0.0,
                'totalProfit': 0.0
            },
            {
                'type': 'บ้าน 2 ชั้น',
                'profitPerItem': 0.0,
                'noItem': 0.0,
                'totalProfit': 0.0
            },
            {
                'type': 'บ้าน 3 ชั้น',
                'profitPerItem': 0.0,
                'noItem': 0.0,
                'totalProfit': 0.0
            }
        ],
        'totalProfit': 0.0,
        'netProfit': 0.0,
        'averageProfitPerHouse': 0.0
    },
    'rateReturn' : {
        'investmentBudget' : 0.0, // งบลงทุน

        'incomePerMonth' : 0.0,   // รายได้ต่อเดือนสุทธิ
        'expensePerMonth' : 0.0, // รายรับต่อเดือน

        'breakEvenPointMonthCash' : 0.0, // จุดคุ้มทุนจำนวนเดือน
        'breakEvenPointYearCash' : 0.0, // จุดคุ้มทุนจำนวนปี
        'bankInvestmentFundRatio' : 80, // สัดส่วนการกู้ธนาคาร
        'privateInvestmentFundRatio' : 20,  // สัดส่วนการเงินส่วนตัว
        'bankInterest' : 8, // อัตราดอกเบี้ย
        'returnRate' : 13, // อัตราผลการตอบแทนที่นักลงทุนต้องการ
        'breakEvenPointMonthBank' : 0.0, // จุดคุ้มทุนจำนวนเดือน
        'breakEvenPointYearBank' : 0.0, // จุดคุ้มทุนจำนวนปี
        'cashFlowYear' : 30, // งบกระแสเงินสด (จำนวนปี)
        'npvValue' : 0.0, // สัดส่วนการเงินส่วนตัว
        'irrValue' : 0.0,
        'financeCosts' : 0.0, // ต้นทุนทางการเงิน
        'paybackPeriod' : 0.0, // ต้นทุนทางการเงิน
        'investmentValue' : 0.0, // จำนวน มูลค่าเงินลงทุน
        'ratioInvestmentValue' : 100, // สัดส่วน มูลค่าเงินลงทุน
        'privateFund' : 0.0, // จำนวน ส่วนทุน
        'ratioPrivateFund' : 0.0, // สัดส่วน ส่วนทุน
        'interestPrivateFund' : 0.0, // ดอกเบี้ย ส่วนทุน
        'borrowFund' : 0.0, // จำนวน ส่วนเงินกู้
        'ratioBorrowFund' : 0.0, // สัดส่วน ส่วนเงินกู้
        'interestBorrowFund' : 0.0, // ดอกเบี้ย ส่วนเงินกู้
        'borrowPeriod' : 4, // ระยะเวลากู้ธนาคาร
    }
};
