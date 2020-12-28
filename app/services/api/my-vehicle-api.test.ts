import { MyVehicleAPI } from '.'
import { makeServer } from './server';
import MockAdapter from 'axios-mock-adapter'
const { API_URL } = require("../../config/env")

const myVehicleAPI = new MyVehicleAPI()
myVehicleAPI.setup();

let server;

beforeEach(() => {
    server = makeServer({ environment: 'test' })
})

afterEach(() => {
    server.shutdown()
})

describe('Test Find All Vehicle API', () => {
    const initialData = {
        filter: {
            where: {
                from: 'south',
                to: 'east'
            }
        }
    }

    it('Should be return all my vehicle when find all data success', async () => {
        // Input
        const filter = initialData

        // Expected Value
        const expectedValue = [
            {
                registration_vehicle: "ทะเบียน กข - 11245",
                car_type: "รถบรรทุกของเหลว 6 ล้อ",
                from: "01/01/62",
                to: "01/01/63",
                status: "APPROVE",
                image_car_type: "truck13",
                owner: {},
            },
            {
                registration_vehicle: "ทะเบียน จก - 44324",
                car_type: "รถกระบะ 4 ล้อคอกสูง",
                from: "19/05/62",
                to: "19/05/63",
                status: "APPROVE",
                image_car_type: "truck2",
                owner: {},
            },
            {
                registration_vehicle: "ทะเบียน ภจ - 23455",
                car_type: "รถกระบะห้องเย็น 4 ล้อตู้ทึบ",
                from: "17/04/62",
                to: "17/04/63",
                status: "PEDING",
                image_car_type: "truck3",
                owner: {},
            }
        ]

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car`, filter).reply(201, expectedValue);

        // Test Functional
        const response = await myVehicleAPI.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input
        const filter = initialData

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car`, filter).reply(403, {
            error: {
                statusCode: '403',
                name: 'NETWORK_ERROR',
                language: 'EN',
                message: {
                    user: 'NETWORK_ERROR',
                    developer: 'NETWORK_ERROR'
                },
                detail: [{}]
            }
        });

        // Test Functional
        const response = await myVehicleAPI.find(filter);
        console.log('response', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input
        const filter = initialData

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car`, filter).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.find(filter);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input
        const filter = initialData

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car`, filter).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.find(filter);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input
        const filter = initialData

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car`, filter).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.find(filter);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})

describe('Test Find One Vehicle API', () => {
    const initialId = 123533

    it('Should be return all my vehicle when find all data success', async () => {
        // Input

        // Expected Value
        const expectedValue = {
            registration_vehicle: "ทะเบียน กข - 11245",
            car_type: "รถบรรทุกของเหลว 6 ล้อ",
            from: "01/01/62",
            to: "01/01/63",
            status: "APPROVE",
            image_car_type: "truck13",
            owner: {},
            vehicle_height: 2.5,
            have_dump: false,
            images: [
                {
                    url: "https://truck.in.th/images/T03/T030709955_1_1551238177.jpeg",
                }, {
                    url: "https://img.kaidee.com/prd/20180706/339715226/b/dafc9446-9a85-439b-ab38-eba1a0a3c164.jpg",
                }, {
                    url: "https://imgc1.taladrod.com/c/cidx/008/421/14_1.jpg",
                }, {
                    url: "https://truck.in.th/images/P09/P090598458_1_1506054693.jpg",
                }
            ],
            workingZones: [
                {
                    region: 'north',
                    province: 'Chiang Mai',
                }
            ]
        }

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car/${initialId}`).reply(201, expectedValue);

        // Test Functional
        const response = await myVehicleAPI.findOne(initialId);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car/${initialId}`).reply(403, {
            error: {
                statusCode: '403',
                name: 'NETWORK_ERROR',
                language: 'EN',
                message: {
                    user: 'NETWORK_ERROR',
                    developer: 'NETWORK_ERROR'
                },
                detail: [{}]
            }
        });

        // Test Functional
        const response = await myVehicleAPI.findOne(initialId);
        console.log('response', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car/${initialId}`).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.findOne(initialId);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car/${initialId}`).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.findOne(initialId);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onGet(`${API_URL}/api/v1/car/${initialId}`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.findOne(initialId);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})

describe('Test Create Vehicle API', () => {
    const initialData = {
        registration_vehicle: "ทะเบียน กข - 11245",
        car_type: "รถบรรทุกของเหลว 6 ล้อ",
        from: "01/01/62",
        to: "01/01/63",
        status: "APPROVE",
        image_car_type: "truck13",
        owner: {},
        vehicle_height: 2.5,
        have_dump: false,
        images: [
            {
                uri: 'image1',
                type: 'jpg',
                name: 'image1',
                size: 12,
                tmp_name: 'image1'
            }, {
                uri: 'image2',
                type: 'jpg',
                name: 'image2',
                size: 22,
                tmp_name: 'image2'
            }, {
                uri: 'image3',
                type: 'jpg',
                name: 'image3',
                size: 32,
                tmp_name: 'image3'
            }, {
                uri: 'image4',
                type: 'jpg',
                name: 'image4',
                size: 42,
                tmp_name: 'image4'
            }
        ],
        workingZones: [
            {
                region: 'north',
                province: 'Chiang Mai',
            }
        ]
    }

    it('Should be return all my vehicle when find all data success', async () => {

        // Expected Value
        const expectedValue = initialData

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/car`, initialData).reply(201, expectedValue);

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(initialData);

        // Expected Result
        // expect(response.kind).toEqual('ok')
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/car`, initialData).reply(403, {
            error: {
                statusCode: '403',
                name: 'NETWORK_ERROR',
                language: 'EN',
                message: {
                    user: 'NETWORK_ERROR',
                    developer: 'NETWORK_ERROR'
                },
                detail: [{}]
            }
        });

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(initialData);
        console.log('response', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/car`, initialData).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(initialData);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/car`, initialData).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(initialData);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/car`, initialData).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(initialData);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})

describe('Test Update Vehicle API', () => {
    const initialId = 49499
    const initialData = {
        registration_vehicle: "ทะเบียน กข - 11245",
        car_type: "รถบรรทุกของเหลว 6 ล้อ",
        have_dump: true,
        images: [
            {
                uri: 'image1',
                type: 'jpg',
                name: 'image1',
                size: 12,
                tmp_name: 'image1'
            }, {
                uri: 'image2',
                type: 'jpg',
                name: 'image2',
                size: 22,
                tmp_name: 'image2'
            }, {
                uri: 'image3',
                type: 'jpg',
                name: 'image3',
                size: 32,
                tmp_name: 'image3'
            }, {
                uri: 'image4',
                type: 'jpg',
                name: 'image4',
                size: 42,
                tmp_name: 'image4'
            }
        ],
    }

    it('Should be return all my vehicle when find all data success', async () => {

        // Expected Value
        const expectedValue = initialData

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPatch(`${API_URL}/api/v1/car/${initialId}`, initialData).reply(201, expectedValue);

        // Test Functional
        const response = await myVehicleAPI.update(initialId, initialData);

        // Expected Result
        // expect(response.kind).toEqual('ok')
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPatch(`${API_URL}/api/v1/car/${initialId}`, initialData).reply(403, {
            error: {
                statusCode: '403',
                name: 'NETWORK_ERROR',
                language: 'EN',
                message: {
                    user: 'NETWORK_ERROR',
                    developer: 'NETWORK_ERROR'
                },
                detail: [{}]
            }
        });

        // Test Functional
        const response = await myVehicleAPI.update(initialId, initialData);
        console.log('response', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPatch(`${API_URL}/api/v1/car/${initialId}`, initialData).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.update(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPatch(`${API_URL}/api/v1/car/${initialId}`, initialData).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.update(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onPatch(`${API_URL}/api/v1/car/${initialId}`, initialData).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.update(initialId, initialData);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})

describe('Test Delete Vehicle API', () => {
    const initialId = 49499

    it('Should be return all my vehicle when find all data success', async () => {

        // Expected Value
        const expectedValue = {}

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/car/${initialId}`).reply(201, expectedValue);

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);

        // Expected Result
        // expect(response.kind).toEqual('ok')
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/car/${initialId}`).reply(403, {
            error: {
                statusCode: '403',
                name: 'NETWORK_ERROR',
                language: 'EN',
                message: {
                    user: 'NETWORK_ERROR',
                    developer: 'NETWORK_ERROR'
                },
                detail: [{}]
            }
        });

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);
        console.log('rdeletee', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/car/${initialId}`).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/car/${initialId}`).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/car/${initialId}`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})
