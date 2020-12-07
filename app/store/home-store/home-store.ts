

import { types } from "mobx-state-tree";

export const HomeStore = types
    .model({
        count: types.number
    })
    .actions(self => ({
        increment() {
            self.count++;
        },
        decrement() {
            self.count--;
        }
    }));

// Type 1 : persist store





// import { types } from "mobx-state-tree";

// const List = types
// 	.model("List", {
// 		items: types.optional(types.frozen, []),
// 		isLoading: types.optional(types.boolean, true),
// 	})
// 	.actions(self => {
// 		function fetchItems(data) {
// 			(self.items = data), (self.isLoading = false);
// 		}
// 		return { fetchItems };
// 	});

// const HomeStore = List.create({});

// export default HomeStore;
