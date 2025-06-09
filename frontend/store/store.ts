import { configureStore } from "@reduxjs/toolkit";
import nft from "./nftSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const store = configureStore({
    reducer:{
        nft
    }
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;