import {create} from "zustand"
import {immer} from "zustand/middleware/immer"
import {locations} from "#constants/index.js"

const DEFAULT_LOCATION = locations.work;

const useLocationStore = create(immer((set) => ({
    activeLocation: DEFAULT_LOCATION,

    setActiveLocation: (location) => set((state) => {
        state.activeLocation = location;
        if(location === undefined) return;
    }),

    resetActiveLocation: () => set((state) => {
        state.activeLocation = DEFAULT_LOCATION;
    }),
})));

export default useLocationStore;