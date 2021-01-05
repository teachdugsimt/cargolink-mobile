import date from 'date-and-time';

export default [
    {
        from: {
            contactMobileNo: '0998999988',
            contactName: 'Onelink Space',
            dateTime: date.format(new Date(), 'DD-MM-YYYY hh:ss'),
            lat: '14.028891',
            lng: '99.570953',
            name: 'วัดน้อยนักบุญอันนา'
        },
        id: 'DIEJ93X',
        owner: {
            companyName: 'Hino',
            email: 'hino.contact@mail.com',
            fullName: 'Hino Link',
            id: 1234,
            mobileNo: '032231120'
        },
        productName: 'ข้าวโพด',
        productTypeId: 2,
        requiredTruckAmount: 2,
        to: [
            {
                contactMobileNo: '0899388403',
                contactName: 'Linda Eye Clinic',
                dateTime: date.format(new Date(), 'DD-MM-YYYY hh:ss'),
                lat: '18.779385738847306',
                lng: '98.97699335637284',
                name: 'Linda Eye Clinic'
            }
        ],
        truckType: 'รถ 6 ล้อตู้คอก',
        weight: 200
    },
    {
        from: {
            contactMobileNo: '0885733800',
            contactName: 'Doctor',
            dateTime: date.format(new Date(), 'DD-MM-YYYY hh:ss'),
            lat: '13.707948249956283',
            lng: '100.53691139352068',
            name: 'ธรรมวัฒน์คลินิกเวชกรรม สาขาทุ่งวัดดอน',
        },
        id: 'OPbDIkx',
        owner: {
            companyName: 'Kingdom',
            email: 'kingdom.contact@mail.com',
            fullName: 'K Ing',
            id: 114,
            mobileNo: '033456789'
        },
        productName: 'หนังสือเรียน',
        productTypeId: 5,
        requiredTruckAmount: 5,
        to: [
            {
                contactMobileNo: '0990999811',
                contactName: 'Master',
                dateTime: date.format(new Date(), 'DD-MM-YYYY hh:ss'),
                lat: '9.138682091131729',
                lng: '99.27335713028324',
                name: 'Suratthani Rajabhat University'
            }
        ],
        truckType: 'รถกระบะตู้คอก',
        weight: 120
    },
]