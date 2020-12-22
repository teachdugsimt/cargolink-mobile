import { types } from "mobx-state-tree"

const StatusStore = types.model({
    status: types.string
})
    .actions(self => ({
        setStatusScreen(status: string) {
            self.status = status
        }
    }))
    .views(self => ({
          
    }))
    .create({
        // IMPORTANT !!
       status: ''
    })

export default StatusStore