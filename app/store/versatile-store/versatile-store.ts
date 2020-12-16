import { types } from "mobx-state-tree";

export const VersatileStore = types.model({
    language: types.string
}).actions(self => ({
    setLanguage(lang) {
        self.language = lang
    }
})).views(self => ({
    get getLanguage() {
        return self.language
    },
}))