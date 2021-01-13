import { types, flow, destroy } from "mobx-state-tree"
import { Platform } from "react-native"
import { FileUploadApi } from '../../services/api/'
const fileUploadApi = new FileUploadApi()

const ImageObject = types.model({
    fileName: types.maybeNull(types.string),
    fileUrl: types.maybeNull(types.string),
    fileType: types.maybeNull(types.string),
    token: types.maybeNull(types.string),
    uploadedDate: types.maybeNull(types.string)
})

const UploadFileStore = types
    .model({
        loading: types.boolean,
        data: types.array(types.model({
            url: types.maybeNull(types.string),
            image: types.maybeNull(ImageObject),
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
            self.loading = true
            try {
                // __DEV__ && console.tron.log('File upload comming :: ', file)
                let formData = new FormData();
                formData.append("file", {
                    name: file.fileName,
                    uri: Platform.OS == 'ios' ? file.uri.replace("file://", "") : file.uri,
                    type: file.type,
                    width: file.width,
                    size: file.fileSize
                })


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
                if (response.ok) {

                    let tmp = self.data
                    if (tmp.find(e => e.position == position)) {
                        tmp.map((e, i) => {
                            if (e.position == position) tmp.splice(i, 1, {
                                url: response.data.fileUrl || '',
                                image: response.data,
                                position
                            })
                        })
                    } else {
                        tmp.push({
                            url: response.data.fileUrl || '',
                            image: response.data,
                            position
                        })
                    }
                    __DEV__ && console.tron.log("TMp before merge :: ", JSON.parse(JSON.stringify(tmp)))

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