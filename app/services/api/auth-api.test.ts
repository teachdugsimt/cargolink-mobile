import { AuthAPI } from '.'
// import { makeServer } from './server';
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

const authAPI = new AuthAPI()
authAPI.setup();

/*
let server;

// jest.mock('react-navigation-hooks', () => ({
    //     useNavigation: () => jest.fn(),
    //     useNavigationParam: jest.fn(jest.requireActual(
        //         'react-navigation-hooks'
        //     ).useNavigationParam),
// }));

beforeEach(() => {
    server = makeServer({ environment: 'test' })
})

afterEach(() => {
    server.shutdown()
})
*/

describe('Test Auth API', () => {

    it('Should be return new token when request auth success', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 7
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toBeTruthy();
        expect(Object.keys(response.data).sort()).toMatchObject(['status', 'tokenCheckPhone', 'token'].sort());
        expect(typeof response.data.status).toEqual('boolean')
        expect(typeof response.data.tokenCheckPhone).toEqual('string')
        expect(typeof response.data.token).toEqual('string')
        expect(response.data.status).toEqual(true)
        expect(response.data.tokenCheckPhone.length).toBeGreaterThan(1)
        expect(response.data.token.length).toBeGreaterThan(1)
    })

    it('Should be return status 400 and kind is rejected when userType is 0', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 0
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Test Functional
        const response = await authAPI.signIn(data);
        console.log('response', JSON.stringify(response))

        // Expected Result
        expect(response.kind).toEqual('rejected')
    })

    it('Should be return status 400 and kind is rejected when length of phone number is not 10', async () => {
        // Input
        const data = {
            phoneNumber: '088888888',
            userType: 7
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Test Functional
        const response = await authAPI.signIn(data);
        console.log('response', JSON.stringify(response))

        // Expected Result
        expect(response.kind).toEqual('rejected')
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 4
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).reply(403, {
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
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 4
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).timeoutOnce()

        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 4
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).networkErrorOnce()

        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 4
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('server')
    })

    it('Should be return error when api throw error', async () => {
        // Input
        const data = {
            phoneNumber: '0888888888',
            userType: 4
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).replyOnce(503)

        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.errorMessage).toBeTruthy()
    })

})

describe('Test Verify OTP API', () => {
    const initialData = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        otp: '3411'
    }

    it('Should be return user profile and token when verify otp success', async () => {
        // Input
        const data = initialData
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value
        const expectedValue = {
            message: '',
            responseCode: 1,
            userProfile: {
                id: 611,
                companyName: null,
                fullName: null,
                mobileNo: '0926270468',
                email: null
            },
            token: {
                accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTEiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjA5MTc5MDcyfQ.GfDTja_mCrqzVTXFYKLOTC5rY2IDFwl69XeGjzj39xPq56pmmNdx2z86bAcTspbQ57Qk9jUtXcnKiDaznEBpuw',
                idToken: '',
                refreshToken: ''
            },
            termOfService: {
                version: '0.0.1',
                accepted: false,
                acceptedAt: null,
                data: 'TERMS OF SERVICE AGREEMENT'
            }
        }

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).reply(201, expectedValue);

        // Test Functional
        const response = await authAPI.verifyOTP(data);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual(expectedValue);
    })

    it('Should be return message error when response code is not 1', async () => {
        // Input
        const data = initialData
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value
        const expectedValue = {
            message: 'OTP verify failured',
            responseCode: 0,
        }

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).reply(201, expectedValue);

        // Test Functional
        const response = await authAPI.verifyOTP(data);

        // Expected Result
        expect(response.kind).toEqual(0)
        expect(response.data).toMatchObject(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input
        const data = {
            ...initialData,
            otp: '4569'
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).reply(403, {
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
        const response = await authAPI.verifyOTP(data);

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input
        const data = {
            ...initialData,
            otp: '3378'
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).timeoutOnce()

        // Test Functional
        const response = await authAPI.verifyOTP(data);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input
        const data = {
            ...initialData,
            otp: '0876'
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).networkErrorOnce()

        // Test Functional
        const response = await authAPI.verifyOTP(data);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input
        const data = {
            ...initialData,
            otp: '4903'
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await authAPI.verifyOTP(data);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

    it('Should be return error when api throw error', async () => {
        // Input
        const data = {
            ...initialData,
            otp: '4903'
        }
        await addMsg(JSON.stringify(data, null, 2))
        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-verify`, data).replyOnce(503)

        // Test Functional
        const response = await authAPI.verifyOTP(data);


        // Expected Result
        expect(response.errorMessage).toBeTruthy()
    })

})

describe('Test Update Term of Service', () => {
    const initialId: number = 12345
    const initialData = {
        accept: true,
        version: '0.0.1'
    }

    it('Should be return update success when update policy of user success', async () => {
        // Input
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Expected Value
        const expectedValue = {}

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).reply(201, expectedValue);

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).reply(403, {
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
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).timeoutOnce()

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).networkErrorOnce()

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('server')
    })

    it('Should be return error when api throw error', async () => {
        await addMsg(JSON.stringify({
            id: initialId,
            data: initialData,
        }))
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`api/v1/users/${initialId}/term-of-service`).replyOnce(503)

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.errorMessage).toBeTruthy()
    })

})
