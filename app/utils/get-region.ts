import { regionListEn, regionListTh } from "../screens/home-screen/manage-vehicle/datasource";
import _ from 'lodash'

export const GetRegion = (id: number, language: string = 'th') => {
  let region = null

  if (language === 'th') {
    region = regionListTh.filter(attr => attr.value === id)[0]
  } else {
    region = regionListEn.filter(attr => attr.value === id)[0]
  }

  return region
}


const checkNationwide = (arr) => {
  var found = false;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].region == 7) {
      found = true;
      break;
    }
  }
  return found
}
export const MapUniqRegion = (item: any) => {
  const newItem = JSON.parse(JSON.stringify(item))
  if (Array.isArray(newItem)) {
    console.log("Come array")
    return newItem.length ? _.uniqBy(newItem, "region") : []
  } else {
    console.log("Come object")
    const tmpItem = JSON.parse(JSON.stringify(item))
    const tmpWorking = tmpItem.workingZones
    let newArrayWorkingZone = tmpWorking && tmpWorking.length ? _.uniqBy(tmpWorking, "region") : []
    // newItem.workingZones = checkNationwide(newArrayWorkingZone) ?
    //   [{ region: 7, province: 7 }] : newArrayWorkingZone
    newItem.workingZones = newArrayWorkingZone
    return newItem
  }
}
