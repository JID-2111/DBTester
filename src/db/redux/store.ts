import { configureStore } from '@reduxjs/toolkit';

import serverConnectionReducer from './ServerConnections/ServerConnection';

export const store = configureStore({
  reducer: {
    connection: serverConnectionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {connection: ServerConnectionState}
export type AppDispatch = typeof store.dispatch;
