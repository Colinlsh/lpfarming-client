import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import blockchainSlice from "./slice/blockchainSlice";

export const store = configureStore({
  reducer: {
    blockchain: blockchainSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
