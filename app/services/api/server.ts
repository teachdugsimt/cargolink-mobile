import { Server, Model } from "miragejs"
import vehicleData from './mock-data/my-vehicle'

const { API_URL, API_URL_DEV } = require("../../config/env")

const makeId = (length: number) => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export function makeServer({ environment = 'development' } = {}) {
    const server = new Server({
        environment,
        models: {
            auth: Model,
            vehicle: Model
        },
        fixtures: {
            vehicles: vehicleData
        },
        seeds(server) {
            server.loadFixtures()
        },
        routes() {
            // Now use this
            this.get(`${API_URL}todos/1`, () => [
                { id: "1", name: "Luke" },
                { id: "2", name: "Leia" },
                { id: "3", name: "Anakin" },
            ])

            this.get(`https://test.callapi.com/listUser`, () => [
                { id: "1", name: "Luke" },
                { id: "2", name: "Leia" },
                { id: "3", name: "Anakin" },
            ])

            this.post(`${API_URL}/api/v1/users/auth/otp-request`, (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                console.log(attrs)
                // debugger
                return {
                    refCode: makeId(4),
                    expireTime: Math.floor(Date.now() / 1000).toString(),
                }
            })

            this.post(`${API_URL}/api/v1/users/auth/otp-verify`, (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                console.log(attrs)
                // debugger
                return {
                    userProfile: {
                        id: Math.floor(Date.now() / 1000).toString(),
                        companyName: "Onelink space",
                    },
                    termOfService: {
                        latestVersion: "0.0.1",
                        latestVersionAgree: true,
                    },
                    token: {
                        idToken: "string",
                        accessToken: "string",
                        refreshToken: "string",
                    },
                }
            })

            this.get(`${API_URL}/api/v1/car`, (schema, request) => {
                // console.log(JSON.parse(JSON.stringify(schema.vehicles.all().models)))
                console.log(JSON.parse(JSON.stringify(server.db.vehicles)))
                return server.db.vehicles
            })

            this.get(`${API_URL}/api/v1/car/:id`, (schema, request) => {
                console.log('request.params.id', request.params.id)
                const id = request.params.id
                return JSON.parse(JSON.stringify(server.db.vehicles.find(id)))
            })

            this.get(`${API_URL}profile/v1`, (params) => {
                console.log("API CONFIG PARAMS :: ", params)
                return {
                    first_name: 'John',
                    last_name: 'Wick',
                    age: 49,
                    account_type: 'Premium Account',
                    tel_no: '0929818252',
                    work_zone: ['Suphanburee', 'Nakhonpathom'],
                    vehicle_details: [{ id: 1, type: '6 truck dump', status: 'ACTIVE', number: 3 },
                    { id: 2, type: '4 car dump crop cap', status: 'ACTIVE', number: 7 }]
                }
            })

            let newId = 3
            this.post(`${API_URL}api/v1/car`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                attrs.id = newId++
                return { reminder: attrs }
            })
        },
    })

    return server;
}