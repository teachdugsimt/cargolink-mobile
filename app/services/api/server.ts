import { Server, Model } from "miragejs"
import vehicleData from './mock-data/my-vehicle'
import policy from './mock-data/policy'

const { API_URL, API_URL_DEV } = require("../../config/env")

const makeId = (length: number) => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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
            vehicle: Model,
            policy: Model,
        },
        fixtures: {
            vehicles: vehicleData,
            policies: policy,
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
                    token: makeId(100),
                    status: true,
                    tokenCheckPhone: makeId(20)
                }
            })

            this.post(`${API_URL}/api/v1/users/auth/otp-verify`, (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                const timestampNow = Math.floor(Date.now() / 1000)
                const id = parseInt(attrs.otp.slice(-1)) % 2 === 0
                    ? timestampNow % 2 === 0 ? timestampNow : timestampNow + 1
                    : timestampNow % 2 === 0 ? timestampNow + 1 : timestampNow
                return {
                    userProfile: {
                        id: id,
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
                    { id: 2, type: '4 car dump crop cap', status: 'ACTIVE', number: 7 }],
                }
            })

            let newId = 3
            this.post(`${API_URL}api/v1/car`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                attrs.id = newId++
                return { reminder: attrs }
            })

            this.get(`${API_URL}/api/v1/users/:id/term-of-service`, (schema, request) => {
                const id = request.params.id
                const accepted = parseInt(id) % 2 === 0 ? true : false;
                console.log('server.db.policies :>> ', server.db.policies.findBy({ accepted }));
                return JSON.parse(JSON.stringify(server.db.policies.findBy({ accepted })))
            })

            this.patch(`${API_URL}/api/v1/users/:id/term-of-service`, (schema, request) => {
                const id = request.params.id
                const accepted = parseInt(id) % 2 === 0 ? true : false;

                // const policy = server.db.policies.findBy({ accepted })

                // const policy = schema.policies.findBy({ accepted })
                // policy.update({ accepted: true, acceptedAt: new Date().toISOString() })
                return {}
            })

            let my_vehicle_id = 1
            this.patch(`${API_URL}api/v1/my-vehicle`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                attrs.id = my_vehicle_id++
                return { reminder: attrs }
            })
        },
    })

    return server;
}