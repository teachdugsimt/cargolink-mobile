import { Server, Model } from "miragejs"
import vehicleData from './mock-data/my-vehicle'
import policy from './mock-data/policy'
import shipperJob from './mock-data/shipper-job'

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
            shipperJob: Model,
        },
        fixtures: {
            vehicles: vehicleData,
            policies: policy,
            shipperJobs: shipperJob
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
                if (parseInt(attrs.otp.slice(-1)) % 9 === 0) {
                    return {
                        message: "OTP is not correct",
                        responseCode: 0,
                        userProfile: null,
                        token: null,
                        termOfService: null,
                    }
                }
                return {
                    message: "",
                    responseCode: 1,
                    userProfile: {
                        id: 611,
                        companyName: null,
                        fullName: null,
                        mobileNo: "0926270468",
                        email: null
                    },
                    token: {
                        accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTEiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjA5MTc5MDcyfQ.GfDTja_mCrqzVTXFYKLOTC5rY2IDFwl69XeGjzj39xPq56pmmNdx2z86bAcTspbQ57Qk9jUtXcnKiDaznEBpuw",
                        idToken: "",
                        refreshToken: ""
                    },
                    termOfService: policy[0]
                }
            })


            this.get(`${API_URL}/api/v1/mobile/carriers/truck/:id`, (schema, request) => {
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

            this.get(`${API_URL}/api/v1/mobile/carriers/truck`, (schema, request) => {
                // console.log(JSON.parse(JSON.stringify(schema.vehicles.all().models)))
                console.log(JSON.parse(JSON.stringify(server.db.vehicles)))
                return server.db.vehicles
            })

            let my_vehicle_id = 1
            this.post(`${API_URL}api/v1/mobile/carriers/truck`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                attrs.id = my_vehicle_id++
                // server.db.vehicles.firstOrCreate(JSON.parse(request.requestBody))
                return { reminder: attrs }
            })

            this.put(`${API_URL}api/v1/mobile/carriers/truck/edit/1`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                attrs.id = my_vehicle_id++
                return { reminder: attrs }
            })

            this.post(`${API_URL}api/v1/media/upload/image`, (schema, request) => {
                let attrs = JSON.parse(request.requestBody)
                // server.db.vehicles.firstOrCreate(JSON.parse(request.requestBody))
                return { reminder: attrs }
            })

            this.get(`${API_URL}/api/v1/mobile/shippers/jobs`, (schema, request) => {
                console.log(JSON.parse(JSON.stringify(server.db.shipperJobs)))
                return server.db.shipperJobs
            })

            this.get(`${API_URL}/api/v1/mobile/shippers/jobs/:id`, (schema, request) => {
                const id = request.params.id
                console.log(JSON.parse(JSON.stringify(server.db.shipperJobs.findBy({ id }))))
                return JSON.parse(JSON.stringify(server.db.shipperJobs.findBy({ id })))
            })

            this.post(`${API_URL}/api/v1/mobile/shippers/jobs`, (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                const result = server.db.shipperJobs.insert(attrs)
                console.log('create shipper job result', result)
                return result
            })

            this.put(`${API_URL}/api/v1/mobile/shippers/jobs/:id`, (schema, request) => {
                const attrs = JSON.parse(request.requestBody)
                return attrs
            })
        },
    })

    return server;
}