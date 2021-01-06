import { ShipperJobAPI } from '.'
import { makeServer } from './server';
import MockAdapter from 'axios-mock-adapter'
import date from 'date-and-time';
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

const shipperJob = new ShipperJobAPI()
shipperJob.setup();
shipperJob.apisauce.headers.Authorization = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTEiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjA5ODU5Nzg2fQ.BN1DOtl8nSKEIUYQZNjccxpGk3Fr595b9UxVT9F8GuImm2nG9wvTfeIscEF44wfD3N3upu335rbT8wR1xZ9HVg'

let jobId = ''
const weight = Math.floor(Math.random() * (999 - 100 + 1) + 100)

const initialData = {
    expiredTime: date.format(new Date(Math.floor(Date.now()) + (48 * 60 * 60 * 1000)), 'DD-MM-YYYY HH:ss'),
    from: {
        contactMobileNo: '0998999988',
        contactName: 'Onelink Space',
        dateTime: date.format(new Date(Math.floor(Date.now()) + (60 * 1000)), 'DD-MM-YYYY HH:ss'),
        // dateTime: '05-01-2021 14:27',
        lat: '14.028891',
        lng: '99.570953',
        name: 'Onelink'
    },
    note: 'Etc.',
    productName: 'อุปกรณ์การเกษตร',
    productTypeId: 21,
    to: [
        {
            contactMobileNo: '0899388403',
            contactName: 'Linda Eye Clinic',
            dateTime: date.format(new Date(Math.floor(Date.now()) + (24 * 60 * 60 * 1000)), 'DD-MM-YYYY HH:ss'),
            lat: '18.779385738847306',
            lng: '98.97699335637284',
            name: 'Linda Eye Clinic'
        },
        {
            contactMobileNo: '0990999811',
            contactName: 'Master',
            dateTime: date.format(new Date(Math.floor(Date.now()) + (32 * 60 * 60 * 1000)), 'DD-MM-YYYY HH:ss'),
            lat: '9.138682091131729',
            lng: '99.27335713028324',
            name: 'Suratthani Rajabhat University'
        }
    ],
    truckAmount: 2,
    truckType: "7",
    weight: weight
}

beforeAll(async () => {
    const result = await shipperJob.create(initialData);
    const list = await shipperJob.find()
    const data = list.data.filter(d => d.weight === weight)
    jobId = data[0].id;
})

describe('Test API Success', () => {
    it('Should be return status 200 when create job success', async (done) => {
        let data = JSON.parse(JSON.stringify(initialData))
        data = {
            ...data,
            note: 'Not note.',
            productName: 'อุปกรณ์ก่อสร้าง',
            productTypeId: 3,
            truckAmount: 4,
            truckType: 17,
            weight: 1520,
        }
        await addMsg(JSON.stringify(data, null, 2))

        // Test Functional
        const response = await shipperJob.create(data);

        expect(response.kind).toEqual('ok')

        done()
    })

    it('Should be return all jobs when find all success and filter is empty object', async (done) => {
        // Input
        const filter = {}
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs from descending when find all success and body.descending = true', async (done) => {
        // Input
        const filter = {
            descending: true
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.from have value', async (done) => {
        // Input
        const filter = {
            from: "Onelink"
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.to have value', async (done) => {
        // Input
        const filter = {
            to: "Silpakorn University"
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.productType have value', async (done) => {
        // Input
        const filter = {
            productType: initialData.productTypeId
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.truckType have value', async (done) => {
        // Input
        const filter = {
            truckType: "7"
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.truckAmountMin have value', async (done) => {
        // Input
        const filter = {
            truckAmountMin: "2"
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })

    it('Should be return all jobs of filter when find all success and body.truckAmountMax have value', async (done) => {
        // Input
        const filter = {
            truckAmountMax: "200"
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })


    it('Should be return all jobs of filter when find all success and body.weight have value', async (done) => {
        // Input
        const filter = {
            weight: initialData.weight
        }
        await addMsg(JSON.stringify(filter, null, 2))

        // Test Functional
        const response = await shipperJob.find(filter);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data.length).toBeGreaterThanOrEqual(1);

        done()
    })


    it(`Should be return data of truck when find one success`, async (done) => {
        await addMsg(JSON.stringify({ id: jobId }, null, 2))
        // Input

        // Expected Value
        const expectedValue = {
            id: jobId,
            productTypeId: initialData.productTypeId,
            productName: initialData.productName,
            truckType: initialData.truckType,
            weight: initialData.weight,
            requiredTruckAmount: initialData.truckAmount,
            from: initialData.from,
            to: initialData.to,
            owner: {
                id: 611,
                companyName: null,
                fullName: null,
                mobileNo: '092xxxx306',
                email: null
            }
        }

        // Test Functional
        const response = await shipperJob.findOne(jobId);

        const {
            id,
            productTypeId,
            productName,
            truckType,
            weight,
            requiredTruckAmount,
            from,
            to,
            owner,
        } = response.data

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toBeTruthy()
        expect(id).toBeTruthy()
        expect(typeof id).toEqual('string')
        expect(id).toEqual(jobId)
        expect(truckType).toEqual(expectedValue.truckType)
        expect(productTypeId).toEqual(expectedValue.productTypeId)
        expect(productName).toEqual(expectedValue.productName)
        expect(weight).toEqual(expectedValue.weight)
        expect(requiredTruckAmount).toEqual(expectedValue.requiredTruckAmount)
        expect(from).toBeTruthy()
        expect(to.length).toEqual(2)
        expect(owner).toBeTruthy()

        done()
    })


    it('Should be return status 200 when update data success', async (done) => {
        let data = JSON.parse(JSON.stringify(initialData))
        data = {
            ...data,
            id: jobId,
            note: 'Not note.',
            productName: 'ยางพารา',
            productTypeId: 9,
            truckAmount: 3,
            truckType: 17,
            weight: 2004,
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Test Functional
        const response = await shipperJob.update(jobId, data);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual(null)

        done()
    })

})

describe('Test API Failured', () => {
    describe('Test Create Vehicle API', () => {

        it('Should be status 400 and kind is rejected when truckType is null', async () => {
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.truckType
            await addMsg(JSON.stringify(data, null, 2))

            const response = await shipperJob.create(data);

            expect(response.kind).toEqual('rejected')
        })

        it('Should be status 400 and kind is rejected when truckAmount is null', async () => {
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.truckAmount
            await addMsg(JSON.stringify(data, null, 2))

            const response = await shipperJob.create(data);

            expect(response.kind).toEqual('rejected')
        })

        it('Should be status 400 and kind is rejected when weight is null', async () => {
            const data = JSON.parse(JSON.stringify(initialData))
            delete data.weight
            await addMsg(JSON.stringify(data, null, 2))

            const response = await shipperJob.create(data);

            expect(response.kind).toEqual('rejected')
        })

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/shippers/jobs`, initialData).reply(403, {
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

            await addMsg(JSON.stringify(initialData, null, 2))

            const response = await shipperJob.create(initialData);
            console.log('response', response)

            expect(response.kind).toEqual('forbidden')
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/shippers/jobs`, initialData).timeoutOnce()

            await addMsg(JSON.stringify(initialData, null, 2))

            const response = await shipperJob.create(initialData);

            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/shippers/jobs`, initialData).networkErrorOnce()

            await addMsg(JSON.stringify(initialData, null, 2))

            const response = await shipperJob.create(initialData);

            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/shippers/jobs`, initialData).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            await addMsg(JSON.stringify(initialData, null, 2))

            const response = await shipperJob.create(initialData);

            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPost(`${API_URL}/api/v1/mobile/shippers/jobs`, initialData).replyOnce(503)

            await addMsg(JSON.stringify(initialData, null, 2))

            const response = await shipperJob.create(initialData);

            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Find All Vehicle API', () => {
        const initialFilter = {}

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            const filter = initialFilter
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs`, filter).reply(403, {
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

            await addMsg(JSON.stringify(filter, null, 2))

            const response = await shipperJob.find(filter);
            console.log('response', response)

            expect(response.kind).toEqual('forbidden')
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            const filter = initialFilter
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs`, filter).timeoutOnce()

            await addMsg(JSON.stringify(filter, null, 2))

            const response = await shipperJob.find(filter);

            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            const filter = initialFilter
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs`, filter).networkErrorOnce()

            await addMsg(JSON.stringify(filter, null, 2))

            const response = await shipperJob.find(filter);

            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            const filter = initialFilter
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs`, filter).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            await addMsg(JSON.stringify(filter, null, 2))

            const response = await shipperJob.find(filter);


            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            const filter = initialFilter
            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs`, filter).replyOnce(503)

            await addMsg(JSON.stringify(filter, null, 2))

            const response = await shipperJob.find(filter);


            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Find One Vehicle API', () => {
        const initialId = jobId

        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            await addMsg(JSON.stringify({ id: initialId }, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`).reply(403, {
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

            const response = await shipperJob.findOne(initialId);
            console.log('response', response)

            expect(response.kind).toEqual('forbidden')
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            await addMsg(JSON.stringify({ id: initialId }, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`).timeoutOnce()

            const response = await shipperJob.findOne(initialId);

            expect(response.kind).toEqual('timeout')
            mock.resetHistory();
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            await addMsg(JSON.stringify({ id: initialId }, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`).networkErrorOnce()

            const response = await shipperJob.findOne(initialId);

            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            await addMsg(JSON.stringify({ id: initialId }, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            const response = await shipperJob.findOne(initialId);


            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            await addMsg(JSON.stringify({ id: initialId }, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onGet(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`).replyOnce(503)

            const response = await shipperJob.findOne(initialId);


            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })

    describe('Test Update Vehicle API', () => {
        const initialId = jobId
        let data = JSON.parse(JSON.stringify(initialData))
        data = {
            ...data,
            id: jobId,
            note: 'Not note.',
            productName: 'ยางพารา',
            productTypeId: 9,
            truckAmount: 3,
            truckType: 17,
            weight: 2004,
        }


        it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`, data).replyOnce(403, {
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

            const response = await shipperJob.update(initialId, data);
            console.log('response', response)

            expect(response.kind).toEqual('forbidden')
            mock.resetHistory();
        })

        it('Should be return TIMEOUT_ERROR when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`, data).timeoutOnce()

            const response = await shipperJob.update(initialId, data);

            expect(response.kind).toEqual('timeout')
        })

        it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
            await addMsg(JSON.stringify(data, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`, data).networkErrorOnce()

            const response = await shipperJob.update(initialId, data);

            expect(response.kind).toEqual('cannot-connect')
            mock.resetHistory();
        })

        it('Should be return SERVER_ERROR when api reject', async () => {
            await addMsg(JSON.stringify(data, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`, data).replyOnce(500, () => {
                throw { message: 'CONNECTION_ERROR' }
            })

            const response = await shipperJob.update(initialId, data);

            expect(response.kind).toEqual('server')
            mock.resetHistory();
        })

        it('Should be return error when api throw error', async () => {
            await addMsg(JSON.stringify(data, null, 2))

            const mock = new MockAdapter(shipperJob.apisauce.axiosInstance);
            mock.onPut(`${API_URL}/api/v1/mobile/shippers/jobs/${initialId}`, data).replyOnce(503)

            const response = await shipperJob.update(initialId, data);


            expect(response.errorMessage).toBeTruthy()
            mock.resetHistory();
        })

    })
})
