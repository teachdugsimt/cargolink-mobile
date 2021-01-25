import TruckTypeStore from '../store/truck-type-store/truck-type-store'

export const GetTruckType = (id: number) => {

    const truckType = TruckTypeStore.list?.filter(type => type.id === id)

    return truckType.length ? truckType[0] : null
}