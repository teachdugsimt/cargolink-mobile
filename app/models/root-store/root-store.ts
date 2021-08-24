import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { HomeStore } from '../../store/home-store/home-store'
import { SigninStore } from '../../store/signin-store/signin-store'
import { VersatileStore } from '../../store/versatile-store/versatile-store'
import { Token } from '../../store/token-store/token-store'

/**
 * A RootStore model.
 */
// prettier-ignore
// export const RootStoreModel = types.model("RootStore").props({
// })

export const RootStoreModel = types.model({
  homeStore: HomeStore,
  signinStore: SigninStore,
  versatileStore: VersatileStore,
  tokenStore: Token,
})
console.log("Root Store Model :: ", RootStoreModel)




/**
 * The RootStore instance.
 */
// export interface RootStore extends Instance<typeof config> { }
export interface RootStore extends Instance<typeof RootStoreModel> { }






/**
 * The data of a RootStore.
 */
// export interface RootStoreSnapshot extends SnapshotOut<typeof Config> { }
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
