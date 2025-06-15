import { configureStore } from "@reduxjs/toolkit";
import refetch from "./refetchSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const store = configureStore({
    reducer:{
        refetch
    }
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;