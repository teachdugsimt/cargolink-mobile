import TruckTypeEN from "../services/api/mock-data/truck-type-en";
import TruckTypeTH from "../services/api/mock-data/truck-type-th";

export const GetTruckType = (id: number, language: string = 'th') => {
    let truckType = null

    if (language === 'th') {
        truckType = TruckTypeTH.filter(attr => attr.id === id)[0]
    } else {
        truckType = TruckTypeEN.filter(attr => attr.id === id)[0]
    }

    return truckType
}