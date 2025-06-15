import { createSlice } from "@reduxjs/toolkit";

type Refetch = {
  token: {
    dashboard: boolean;
    resourcesTab: boolean;
    tokensTab: boolean;
  };
  resource: {
    dashboard?: boolean;
    resourcesTab?: boolean;
  };
};

const initialState:Refetch = {
  token: {
    dashboard: false,
    resourcesTab: false,
    tokensTab: false
  },
  resource: {
    dashboard: false,
    resourcesTab: false
  }
};

const refetchSlice = createSlice({
  name: "refetch",
  initialState,
  reducers: {
    setTokenRefetch: (state, action) => {
      const { dashboard, resourcesTab, tokensTab } = action.payload;
      state.token.dashboard = dashboard as boolean;
      state.token.resourcesTab = resourcesTab as boolean;
      state.token.tokensTab = tokensTab as boolean;
    },
    setResourceRefetch: (state, action) => {
      const { dashboard, resourcesTab } = action.payload;
      state.resource.dashboard = dashboard as boolean;
      state.resource.resourcesTab = resourcesTab as boolean;
    },
  },
});

export const { setTokenRefetch, setResourceRefetch } = refetchSlice.actions;
export default refetchSlice.reducer;