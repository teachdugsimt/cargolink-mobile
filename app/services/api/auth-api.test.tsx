import React from 'react'
import { AuthAPI, MockApi } from './'
import { makeServer } from './server';
import { SigninScreen } from '../../screens/'
import App from '../../app'
import { render, fireEvent } from '@testing-library/react-native';

interface Input {
    mobileNo: string
    userType: number
}

const authAPI = new AuthAPI()
const mockAPI = new MockApi()
let server;

jest.mock('react-navigation-hooks', () => ({
    useNavigation: () => jest.fn(),
    useNavigationParam: jest.fn(jest.requireActual(
        'react-navigation-hooks'
    ).useNavigationParam),
}));

beforeEach(() => {
    server = makeServer({ environment: 'test' })
})

afterEach(() => {
    server.shutdown()
})

test('loads and displays greeting', async () => {
    const { getByTestId } = render(<SigninScreen />)
    //   await waitForElement(() => getByTestId("user-1"))
    //   await waitForElement(() => getByTestId("user-2"))

    //   expect(getByTestId("user-1")).toHaveTextContent("Luke")
    //   expect(getByTestId("user-2")).toHaveTextContent("Leia")
})

// it('Shoud be return new token when signin success', async () => {
//     const { getByText } = render(<App />)
// })