import { createSlice } from "@reduxjs/toolkit";

type NFT = {
    token: number
    address: string
};

const initialState:NFT[] = [];

const walletSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    add: (state, action) => {
      state.push(action.payload);
    },
    burn: (state, action) => {
      return state.filter(key => key != action.payload);
    },
    replace: (state, action) => {
      return action.payload;
    }
  },
});

export const { add, burn, replace } = walletSlice.actions;
export default walletSlice.reducer;