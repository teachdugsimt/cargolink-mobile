import { regionListEn, regionListTh } from "../screens/home-screen/manage-vehicle/datasource";

export const GetRegion = (id: number, language: string = 'th') => {
    let region = null

    if (language === 'th') {
        region = regionListTh.filter(attr => attr.value === id)[0]
    } else {
        region = regionListEn.filter(attr => attr.value === id)[0]
    }

    return region
}