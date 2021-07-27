export const MapTruckImageName = (id) => {
  if (id == 1 || id == "fourWheelsTruck") return "truck" // รถกระบะ 4 ล้อ
  else if (id == 2 || id == "4WheelsFlatbed") return "truck7" // รถกระบะ 4 ล้อ พื้นเรียบ
  else if (id == 3 || id == "4wheelsOpenPickup") return "truck6" // รถกระบะ 4 ล้อ คอก
  else if (id == 4 || id == "4WheelsCabinetPickup") return "truck3" // รถกระบะ 4 ล้อ ตู้ทึบ
  else if (id == 5 || id == "4WheelsRefrigeratorPickup") return "truck4" // รถกระบะ 4 ล้อ ห้องเย็น
  else if (id == 6 || id == "4WheelsCap") return "truck5" // รถกระบะ 4 ล้อ หลังคาสูงทึบ


  else if (id == 7 || id == "6WheelsFlatbed") return "truck9" // รถ 6 ล้อ พื้นเรียบ
  else if (id == 8 || id == "6WheelsOpenTop") return "truck8" // รถ 6 ล้อ กระบะ
  else if (id == 9 || id == "6WheelsBox") return "truck12" // รถ 6 ล้อ คอก
  else if (id == 10 || id == "6WheelsCabinet") return "truck10" // รถ 6 ล้อ ตู้ทึบ
  else if (id == 11 || id == "6WheelsRefrigerator") return "truck11" // รถ 6 ล้อ ห้องเย็น
  else if (id == 12 || id == "6WheelsLiquidTank") return "truck13" // รถ 6 ล้อ บรรทุกของเหลว
  else if (id == 13 || id == "6WheelsCrane") return "truck14" // รถ 6 ล้อ เครน


  else if (id == 14 || id == "10WheelsFlatbed") return "truck20" // รถ 10 ล้อ พื้นเรียบ
  else if (id == 15 || id == "10WheelBox") return "truck17"  // รถ 10 ล้อ คอก
  else if (id == 16 || id == "10WheelsCabinet") return "truck15"  // รถ 10 ล้อ ตู้ทึบ
  else if (id == 17 || id == "10WheelsRefrigerator") return "truck16"  // รถ 10 ล้อ ห้องเย็น
  else if (id == 18 || id == "10WheelsChemicalLiquidTank") return "truck21"  // รถ 10 ล้อ เคมีภัณฑ์
  else if (id == 19 || id == "10WheelsLiquidTank") return "truck22"  // รถ 10 ล้อ บรรทุกของเหลว
  else if (id == 20 || id == "tenWheelsFuelTanker") return "truck23"  // รถ 10 ล้อ บรรทุกน้ำมัน
  else if (id == 21 || id == "10WheelsMobileCrane") return "truck19" // รถ 10 ล้อ เครน


  else if (id == 22 || id == "18WheelsFlatbed") return "truck26" // รถเทรลเลอร์ พื้นเรียบ
  else if (id == 23 || id == "fortyTrailer18WheelsStallTruck") return "truck32"   // รถเทรลเลอร์ คอก
  else if (id == 24 || id == "20Trainer18WheelsStallDump") return "truck31" // รถ 10 ล้อ พ่วงคอก
  else if (id == 25 || id == "20Trailer18WheelsCabinet") return "truck29" // รถ 10 ล้อ พ่วงตู้ทึบ
  else if (id == 26 || id == "20Trailer18WheelsRefrigerator") return "truck30" // รถ 10 ล้อ พ่วงห้องเย็น
  

  else if (id == 27 || id == "12WheelsCarCarrier") return "truck35" // รถบรรทุกรถ
  else if (id == 28 || id == "6WheelsMotobikeCarrier") return "truck36"  // รถบรรทุกจักรยานยนต์
  else if (id == 29 || id == "other") return "truck" // อื่นๆ
  else if (id == 30 || id == "tractorHeadTruck") return "truck27" // รถหัวลาก
  else if (id == 31 || id == "40ContainerTrailer") return "truck25" // รถหัวลาก ตู้ทึบ
  else if (id == 32 || id == "40RefrigeratorContainerTrailer") return "truck24"  // รถหัวลาก ห้องเย็น

  
  else return "greyMock"

}

