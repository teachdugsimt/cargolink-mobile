import { MyVehicleAPI } from '.'
import { makeServer } from './server';
import MockAdapter from 'axios-mock-adapter'
import { addMsg } from 'jest-html-reporters/helper'
const { API_URL } = require("../../config/env")

jest.mock('./api-problem', () => {
    return {
        getGeneralApiProblem: (response) => {
            if (response.status === 503) {
                throw {
                    errorMessage: "ERROR_EXCEPTION"
                }
            }
            switch (response.problem) {
                case "CONNECTION_ERROR":
                    return { kind: "cannot-connect", temporary: true }
                case "NETWORK_ERROR":
                    return { kind: "cannot-connect", temporary: true }
                case "TIMEOUT_ERROR":
                    return { kind: "timeout", temporary: true }
                case "SERVER_ERROR":
                    return { kind: "server" }
                case "UNKNOWN_ERROR":
                    return { kind: "unknown", temporary: true }
                case "CLIENT_ERROR":
                    switch (response.status) {
                        case 401:
                            return { kind: "unauthorized" }
                        case 403:
                            return { kind: "forbidden" }
                        case 404:
                            return { kind: "not-found" }
                        default:
                            return { kind: "rejected" }
                    }
                case "CANCEL_ERROR":
                    return null
            }
            return null
        }
    }
})

jest.mock('../../utils/storage', () => {
    return {
        load: (val) => {
            return {
                tokenStore: {
                    token: {
                        accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTEiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjEwMTIzODkwfQ.VEshqNw4fNdyszYSgJvpRsj1opbXNTVkh_fkNvtJhpTMNk5RdW2lNc5Dbw4GYsqKRBA30q2QhX8cLJoWgEll3g"
                    }
                }
            }
        }
    }
})

const myVehicleAPI = new MyVehicleAPI()
/*
let server;

beforeEach(() => {
    server = makeServer({ environment: 'test' })
})

afterEach(() => {
    server.shutdown()
})
*/

let truckId = ''
const initialData = {
    carrierId: Math.floor(Math.random() * 10000),
    loadingWeight: 20,
    registrationNumber: [
        `กข ${Math.floor(1000 + Math.random() * 9000)}`,
        `กง ${Math.floor(1000 + Math.random() * 9000)}`
    ],
    stallHeight: 2.5,
    tipper: true,
    truckPhotos: {
        back: "https://truck.in.th/images/T03/T030709955_1_1551238177.jpeg",
        front: "https://img.kaidee.com/prd/20180706/339715226/b/dafc9446-9a85-439b-ab38-eba1a0a3c164.jpg",
        left: "https://imgc1.taladrod.com/c/cidx/008/421/14_1.jpg",
        right: "https://truck.in.th/images/P09/P090598458_1_1506054693.jpg",
    },
    truckType: 18,
    workingZones: [
        { region: 1, "province": 2 },
        { region: 3, "province": 67 }
    ]
}

beforeAll(async () => {
    await myVehicleAPI.setup()
    const result = await myVehicleAPI.createVehicleProfile(initialData);
    console.log('result', result)
    truckId = result.data.id
})

describe('Test API Success', () => {
    it('Should be return data of truck when create data success', async (done) => {
        const data = {
            carrierId: Math.floor(Math.random() * 10000),
            loadingWeight: 20,
            registrationNumber: [
                `ตก ${Math.floor(1000 + Math.random() * 9000)}`,
                `อด ${Math.floor(1000 + Math.random() * 9000)}`
            ],
            stallHeight: 2.5,
            tipper: true,
            truckPhotos: {
                back: "https://truck.in.th/images/T03/T030709955_1_1551238177.jpeg",
                front: "https://img.kaidee.com/prd/20180706/339715226/b/dafc9446-9a85-439b-ab38-eba1a0a3c164.jpg",
                left: "https://imgc1.taladrod.com/c/cidx/008/421/14_1.jpg",
                right: "https://truck.in.th/images/P09/P090598458_1_1506054693.jpg",
            },
            truckType: 18,
            workingZones: [
                { region: 2, "province": 21 },
            ]
        }
        await addMsg(JSON.stringify(data, null, 2))

        // Test Functional
        const response = await myVehicleAPI.createVehicleProfile(data);

        // Expected Value
        const expectedValue = {
            truckType: 18,
            loadingWeight: 20,
            stallHeight: 2.5,
            approveStatus: 'Pending',
            registrationNumber: data.registrationNumber,
            truckPhotos: data.truckPhotos,
            workingZones: data.workingZones,
            tipper: true
        }

        const {
            id,
            truckType,
            loadingWeight,
            stallHeight,
            createdAt,
            updatedAt,
            approveStatus,
            registrationNumber,
            truckPhotos,
            workingZones,
            tipper,
        } = response.data

        truckId = id

        console.log('truckId', truckId)

        // Expected Result
        expect(response.data).toBeTruthy()
        expect(id).toBeTruthy()
        expect(typeof id).toEqual('string')
        expect(truckType).toEqual(expectedValue.truckType)
        expect(loadingWeight).toEqual(expectedValue.loadingWeight)
        expect(stallHeight).toEqual(expectedValue.stallHeight)
        expect(createdAt).toBeTruthy()
        expect(updatedAt).toBeTruthy()
        expect(approveStatus).toEqual(expectedValue.approveStatus)
        expect(registrationNumber.length).toEqual(2)
        expect(truckPhotos.front).toEqual(expectedValue.truckPhotos.front)
        expect(truckPhotos.back).toEqual(expectedValue.truckPhotos.back)
        expect(truckPhotos.left).toEqual(expectedValue.truckPhotos.left)
        expect(truckPhotos.right).toEqual(expectedValue.truckPhotos.right)
        expect(workingZones.length).toEqual(1)
        expect(workingZones[0].region).toEqual(expectedValue.workingZones[0].region)
        expect(workingZones[0].province).toEqual(expectedValue.workingZones[0].province)
        expect(tipper).toEqual(true)

        done()
    })

    it('Should be return all my vehicle when find all data success', async (done) => {
        // Input
        const filter = {}
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await myVehicleAPI.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })


    it(`Should be return data of truck when find one success`, async (done) => {
        // Input
        await addMsg(JSON.stringify({ id: truckId }, null, 2))
        // Expected Value
        const expectedValue = {
            id: truckId,
            truckType: initialData.truckType,
            loadingWeight: initialData.loadingWeight,
            stallHeight: initialData.stallHeight,
            createdAt: '2021-01-04T05:30:26Z',
            updatedAt: '2021-01-04T05:30:26Z',
            approveStatus: 'Pending',
            registrationNumber: initialData.registrationNumber,
            truckPhotos: initialData.truckPhotos,
            workingZones: initialData.workingZones,
            tipper: initialData.tipper
        }

        // Test Functional
        const response = await myVehicleAPI.findOne(truckId);

        const {
            id,
            truckType,
            loadingWeight,
            stallHeight,
            createdAt,
            updatedAt,
            approveStatus,
            registrationNumber,
            truckPhotos,
            workingZones,
            tipper,
        } = response.data

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toBeTruthy()
        expect(id).toBeTruthy()
        expect(typeof id).toEqual('string')
        expect(id).toEqual(truckId)
        expect(truckType).toEqual(expectedValue.truckType)
        expect(loadingWeight).toEqual(expectedValue.loadingWeight)
        expect(stallHeight).toEqual(expectedValue.stallHeight)
        expect(createdAt).toBeTruthy()
        expect(updatedAt).toBeTruthy()
        expect(approveStatus).toEqual(expectedValue.approveStatus)
        expect(registrationNumber.length).toEqual(2)
        expect(truckPhotos.front).toEqual(expectedValue.truckPhotos.front)
        expect(truckPhotos.back).toEqual(expectedValue.truckPhotos.back)
        expect(truckPhotos.left).toEqual(expectedValue.truckPhotos.left)
        expect(truckPhotos.right).toEqual(expectedValue.truckPhotos.right)
        expect(workingZones.length).toEqual(1)
        // expect(workingZones[0].region).toEqual(expectedValue.workingZones[0].region)
        // expect(workingZones[0].province).toEqual(expectedValue.workingZones[0].province)
        expect(tipper).toEqual(true)

        done()
    })


    it('Should be return status 200 when update data success', async (done) => {
        const data = {
            id: truckId,
            truckType: 18,
            workingZones: initialData.workingZones,
            registrationNumber: initialData.registrationNumber,
            stallHeight: initialData.stallHeight,
            loadingWeight: 3.2,
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Test Functional
        const response = await myVehicleAPI.patchMyVehicle(data);

        // Expected Result
        expect(response.ok).toEqual(true)
        expect(response.status).toEqual(200)

        done()
    })

})

describe('Test API Failured', () => {
    describe('Test Create Vehicle API', () => {

        it('Should be status 400 and kind is rejected when stallHeight is null', async () => {
            // Test Functional
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.stallHeight
            await addMsg(JSON.stringify(data, null, 2))

            const response = await myVehicleAPI.createVehicleProfile(data);

            // Expected Result
            expect(response.kind).toEqual('rejected')
        })

        it('Should be status 400 and kind is rejected when loadingWeight is null', async () => {
            // Test Functional
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.loadingWeight
            await addMsg(JSON.stringify(data, null, 2))

            const response = await myVehicleAPI.createVehicleProfile(data);

            // Expected Result
            expect(response.kind).toEqual('rejected')
        })

        it('Should be status 400 and kind is rejected when truckType is null', async () => {
            // Test Functional
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.truckType
            await addMsg(JSON.stringify(data, null, 2))

            const response = await myVehicleAPI.createVehicleProfile(data);

            // Expected Result
            expect(response.kind).toEqual('rejected')
        })

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            await addMsg(JSON.stringify(initialData, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/carriers/truck`, initialData).reply(403, {
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
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            await addMsg(JSON.stringify(initialData, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/carriers/truck`, initialData).timeoutOnce()

            // Test Functional
            const response = await myVehicleAPI.createVehicleProfile(initialData);

            // Expected Result
            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            await addMsg(JSON.stringify(initialData, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/carriers/truck`, initialData).networkErrorOnce()

            // Test Functional
            const response = await myVehicleAPI.createVehicleProfile(initialData);

            // Expected Result
            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            await addMsg(JSON.stringify(initialData, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/carriers/truck`, initialData).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            // Test Functional
            const response = await myVehicleAPI.createVehicleProfile(initialData);


            // Expected Result
            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            await addMsg(JSON.stringify(initialData, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/carriers/truck`, initialData).replyOnce(503)

            // Test Functional
            const response = await myVehicleAPI.createVehicleProfile(initialData);


            // Expected Result
            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Find All Vehicle API', () => {
        const initialFilter = {}

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            // Input
            const filter = initialFilter
            await addMsg(JSON.stringify(filter, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck`, filter).reply(403, {
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
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            // Input
            const filter = initialFilter
            await addMsg(JSON.stringify(filter, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck`, filter).timeoutOnce()

            // Test Functional
            const response = await myVehicleAPI.find(filter);

            // Expected Result
            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            // Input
            const filter = initialFilter
            await addMsg(JSON.stringify(filter, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck`, filter).networkErrorOnce()

            // Test Functional
            const response = await myVehicleAPI.find(filter);

            // Expected Result
            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            // Input
            const filter = initialFilter
            await addMsg(JSON.stringify(filter, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck`, filter).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            // Test Functional
            const response = await myVehicleAPI.find(filter);


            // Expected Result
            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            // Input
            const filter = initialFilter
            await addMsg(JSON.stringify(filter, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck`, filter).replyOnce(503)

            // Test Functional
            const response = await myVehicleAPI.find(filter);


            // Expected Result
            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Find One Vehicle API', () => {
        const initialId = truckId || 'Q3K2W0Z7'

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            // Input
            await addMsg(JSON.stringify({ id: initialId }, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).reply(403, {
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
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            // Input
            await addMsg(JSON.stringify({ id: initialId }, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).timeoutOnce()

            // Test Functional
            const response = await myVehicleAPI.findOne(initialId);

            // Expected Result
            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            // Input
            await addMsg(JSON.stringify({ id: initialId }, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).networkErrorOnce()

            // Test Functional
            const response = await myVehicleAPI.findOne(initialId);

            // Expected Result
            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            // Input
            await addMsg(JSON.stringify({ id: initialId }, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            // Test Functional
            const response = await myVehicleAPI.findOne(initialId);


            // Expected Result
            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            // Input
            await addMsg(JSON.stringify({ id: initialId }, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).replyOnce(503)

            // Test Functional
            const response = await myVehicleAPI.findOne(initialId);


            // Expected Result
            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Update Vehicle API', () => {
        const initialId = truckId || 'Q3K2W0Z7'
        const data = {
            id: initialId,
            truckType: 18,
            workingZones: initialData.workingZones,
            registrationNumber: initialData.registrationNumber,
            stallHeight: initialData.stallHeight,
        }


        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/carriers/truck/edit/${initialId}`, data).reply(403, {
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
            const response = await myVehicleAPI.patchMyVehicle(data);
            console.log('response', response)

            // Expected Result
            expect(response.kind).toEqual('forbidden')
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/carriers/truck/edit/${initialId}`, data).timeoutOnce()

            // Test Functional
            const response = await myVehicleAPI.patchMyVehicle(data);

            // Expected Result
            expect(response.kind).toEqual('timeout')
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/carriers/truck/edit/${initialId}`, data).networkErrorOnce()

            // Test Functional
            const response = await myVehicleAPI.patchMyVehicle(data);

            // Expected Result
            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            await addMsg(JSON.stringify(data, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/carriers/truck/edit/${initialId}`, data).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            // Test Functional
            const response = await myVehicleAPI.patchMyVehicle(data);

            // Expected Result
            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            await addMsg(JSON.stringify(data, null, 2))
            // Expected Value

            // Mocking Function
            const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/carriers/truck/edit/${initialId}`, data).replyOnce(503)

            // Test Functional
            const response = await myVehicleAPI.patchMyVehicle(data);

            // Expected Result
            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })
})

/*
describe('Test Delete Vehicle API', () => {
    const initialId = 49499

    it('Should be return all my vehicle when find all data success', async () => {

        // Expected Value
        const expectedValue = {}

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).reply(201, expectedValue);

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
        mock.onDelete(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).reply(403, {
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
        mock.onDelete(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).timeoutOnce()

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).networkErrorOnce()

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(myVehicleAPI.apisauce.axiosInstance);
        mock.onDelete(`${API_URL}/api/v1/mobile/carriers/truck/${initialId}`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await myVehicleAPI.delete(initialId);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})
*/
