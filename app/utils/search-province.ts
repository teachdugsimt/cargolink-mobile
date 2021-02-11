import { provinceListEn, provinceListTh } from "../screens/home-screen/manage-vehicle/datasource";

let arrProvinceTh = null
let arrProvinceEn = null

export const SearchByProvinceTh = (province: string) => {
  if (Number(province)) {
    return null
  }

  if (!arrProvinceTh) {
    arrProvinceTh = provinceListTh.map(({ label }) => label)
  }
  const resultProvinceTh = arrProvinceTh.filter(prov => prov === province)

  if (resultProvinceTh.length) {
    return resultProvinceTh[0]
  }

  return null
}

export const SearchByProvinceEn = (province: string) => {
  if (Number(province)) {
    return null
  }

  if (!arrProvinceEn) {
    arrProvinceEn = provinceListEn.map(({ label }) => label)
  }
  const resultProvinceEn = arrProvinceEn.filter(prov => prov === province)

  if (resultProvinceEn.length) {
    return resultProvinceEn[0]
  }

  return null
}

export const SearchByAddressTh = (address: string) => {
  if (!address) return null
  const arrAddress = address.split(/\s+/)
  let provinceResult = null

  arrAddress.forEach(addr => {
    const result = SearchByProvinceTh(addr)
    if (result) {
      provinceResult = result
      return true;
    }
  })

  return provinceResult
}

export const SearchByAddressEn = (address: string) => {
  if (!address) return null
  const arrAddress = address.split(/\s+/)
  let provinceResult = null

  arrAddress.forEach(addr => {
    const result = SearchByProvinceEn(addr)
    if (result) {
      provinceResult = result
      return true;
    }
  })

  return provinceResult
}

export const GetProvinceByEnArress = (address: string) => {
  try {
    if (!address) return null
    const arrAddressEn = address.split(', ')

    const reg = new RegExp("Chang Wat ", "s");
    const arrProvince = arrAddressEn[arrAddressEn.length - 2].split(reg)
    const provinceAddr = arrProvince.length > 1 ? arrProvince[arrProvince.length - 1] : arrProvince[0]

    const province = provinceAddr.split(' ')
    province.pop()

    return province.join(' ')
  } catch (err) {
    __DEV__ && console.tron.log('err', err)
    return null;
  }
}
