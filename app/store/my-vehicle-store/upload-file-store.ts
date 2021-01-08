import { types, flow, destroy } from "mobx-state-tree"
import { FileUploadApi } from '../../services/api/'
const fileUploadApi = new FileUploadApi()

const UploadFileStore = types
    .model({
        loading: types.boolean,
        data: types.array(types.model({
            url: types.maybeNull(types.string),
            position: types.maybeNull(types.string)
        })),
        error: types.string
    })
    // .volatile(() => ({
    //     file: null,
    // }))
    .actions(self => ({
        // setPicture(file) {
        //     self.file = file;
        // },
        uploadImage: flow(function* (file, position) {
            yield fileUploadApi.setup()
            console.log("Config Header here :: => " ,fileUploadApi.apisauce)
            self.loading = true
            try {
                console.log('File upload comming :: ', file)
                let formData = new FormData();
                formData.append("file", file)


                // formData.append('file', file);
                // formData.append('fullPath', file.paths)
                // formData.append('fullPathWithoutFile', file.paths.slice(0, file.paths.lastIndexOf('/')))
                // formData.append('id', file.id)
                // formData.append('name', file.name)
                // formData.append('paths', file.path)
                // formData.append('realName', file.name)
                // formData.append('url', file.uri)
                // console.log("Form data after BUILD :: => ", formData)

                const response = yield fileUploadApi.uploadVehiclePicture(formData)
                console.log("🚀 ~ file: upload-file-store.ts ~ line 39 ~ uploadImage:flow ~ response : ", response)
                if (response.ok) {

                    let tmp = self.data
                    if (tmp.find(e => e.position == position)) {
                        tmp.map((e, i) => {
                            if (e.position == position) tmp.splice(i, 1, {
                                url: response.data.reminder.url || '',
                                position
                            })
                        })
                    } else {
                        tmp.push({
                            url: response.data.reminder.url || '',
                            position
                        })
                    }
                    console.log("TMp before merge :: ", JSON.parse(JSON.stringify(tmp)))

                    self.data = tmp
                } else {
                    self.error = response.data.message
                }
                self.loading = false

            } catch (error) {
                self.loading = false
                self.error = "error for store value to upload store"
            }
        }),

        deleteUploadData() {
            destroy(self.data)
        }
    }))
    .create({
        loading: false,
        data: [],
        error: '',
    })

export default UploadFileStore