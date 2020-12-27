import { AuthAPI } from '.'
import { makeServer } from './server';
import MockAdapter from 'axios-mock-adapter'
const { API_URL } = require("../../config/env")

interface AuthInput {
    mobileNo: string
    userType: number
}

interface OTPVerifyInput {
    token: string
    otpCode: string
}

const authAPI = new AuthAPI()
authAPI.setup();

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

describe('Test Auth API', () => {

    it('Should be return new token when request auth success', async () => {
        // Input
        const data: AuthInput = {
            mobileNo: '+6689999999',
            userType: 4
        }

        // Expected Value
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPost(`${API_URL}/api/v1/users/auth/otp-request`, data).reply(201, {
            token
        });

        // Test Functional
        const response = await authAPI.signIn(data);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual({ token });
    })


    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input
        const data: AuthInput = {
            mobileNo: '+6689999999',
            userType: 4
        }

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
        console.log('response', response)

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input
        const data: AuthInput = {
            mobileNo: '+6689999999',
            userType: 4
        }

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
        const data: AuthInput = {
            mobileNo: '+6689999999',
            userType: 4
        }

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
        const data: AuthInput = {
            mobileNo: '+6689999999',
            userType: 4
        }

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

})

describe('Test Verify OTP API', () => {
    const initialData: OTPVerifyInput = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        otpCode: '3411'
    }

    it('Should be return user profile and token when verify otp success', async () => {
        // Input
        const data = initialData

        // Expected Value
        const expectedValue = {
            userProfile: {
                id: 122231,
                companyName: 'Hino',
                fullname: 'Mr. Unit Test',
                mobileNo: '+66988000000',
                email: 'unite.test@mail.com',
                language: 'TH',
            },
            termOfService: {
                latestVersion: '1.22.1',
                latestVersionAgree: true,
            },
            token: {
                idToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
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

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input
        const data = {
            ...initialData,
            otpCode: '4569'
        }

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
            otpCode: '3378'
        }

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
            otpCode: '0876'
        }

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
            otpCode: '4903'
        }

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

})

describe('Test Get Policy API', () => {
    const initialId: number = 12345

    it('Should be return policy of user when get policy success', async () => {
        // Input

        // Expected Value
        const expectedValue = {
            version: '1.0.1',
            accepted: true,
            acceptedAt: new Date().toISOString(),
            data: 'term of service message'
        }

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onGet(`api/v1/users/${initialId}/term-of-service`).reply(201, expectedValue);

        // Test Functional
        const response = await authAPI.getPolicy(initialId);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onGet(`api/v1/users/${initialId}/term-of-service`).reply(403, {
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
        const response = await authAPI.getPolicy(initialId);

        // Expected Result
        expect(response.kind).toEqual('forbidden')
    })

    it('Should be return TIMEOUT_ERROR when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onGet(`api/v1/users/${initialId}/term-of-service`).timeoutOnce()

        // Test Functional
        const response = await authAPI.getPolicy(initialId);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onGet(`api/v1/users/${initialId}/term-of-service`).networkErrorOnce()

        // Test Functional
        const response = await authAPI.getPolicy(initialId);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onGet(`api/v1/users/${initialId}/term-of-service`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await authAPI.getPolicy(initialId);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})

describe('Test Update Policy of User API', () => {
    const initialId: number = 12345
    const initialData = {
        accept: true
    }

    it('Should be return update success when update policy of user success', async () => {
        // Input

        // Expected Value
        const expectedValue = {}

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPatch(`api/v1/users/${initialId}/term-of-service`).reply(201, expectedValue);

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('ok')
        expect(response.data).toEqual(expectedValue);
    })

    it('Should be return NETWORK_ERROR and status 403 when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPatch(`api/v1/users/${initialId}/term-of-service`).reply(403, {
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
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPatch(`api/v1/users/${initialId}/term-of-service`).timeoutOnce()

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('timeout')
    })

    it('Should be return NETWORK_ERROR and kind = cannot-connect when auth failured', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPatch(`api/v1/users/${initialId}/term-of-service`).networkErrorOnce()

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);

        // Expected Result
        expect(response.kind).toEqual('cannot-connect')
    })

    it('Should be return SERVER_ERROR when api reject', async () => {
        // Input

        // Expected Value

        // Mocking Function
        const mock = new MockAdapter(authAPI.apisauce.axiosInstance);
        mock.onPatch(`api/v1/users/${initialId}/term-of-service`).replyOnce(500, () => {
            throw { message: 'CONNECTION_ERROR' }
        })

        // Test Functional
        const response = await authAPI.updatePolicy(initialId, initialData);


        // Expected Result
        expect(response.kind).toEqual('server')
    })

})
