import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import getRightClient from '../../clients/ClientUtils';
import ServerInterface from '../../clients/ServerInterface';
import { ConnectionModelType } from '../../models/ConnectionModels';
import { RootState } from '../store';

enableMapSet();
export interface ServerConnectionState {
  serverConnectionModel: ConnectionModelType | null;
  database: Map<string, ServerInterface>;
  currentDatabase: string;
}

const initialState: ServerConnectionState = {
  serverConnectionModel: null,
  database: new Map<string, ServerInterface>(),
  currentDatabase: '',
};

// eslint-disable-next-line import/prefer-default-export
export const serverConnectionSlice = createSlice({
  name: 'serverConnection',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ConnectionModelType>) => {
      state.serverConnectionModel = action.payload;
      state.database.forEach((value) => {
        value.pool.end();
      });
      state.database.clear();
      state.currentDatabase = state.serverConnectionModel.defaultDatabase;
      state.database.set(
        state.currentDatabase,
        getRightClient(state.serverConnectionModel, state.currentDatabase)
      );
    },
    clear: (state) => {
      state.serverConnectionModel = null;
      state.database.forEach((connection: ServerInterface) => {
        connection.pool.end();
      });
      state.database.clear();
      state.currentDatabase = '';
    },
    setDB: (state, action: PayloadAction<string>) => {
      if (state.serverConnectionModel === null) return;
      state.database.set(
        action.payload,
        getRightClient(state.serverConnectionModel, action.payload)
      );
      state.currentDatabase = action.payload;
    },
  },
});

export const { change, clear, setDB } = serverConnectionSlice.actions;

export const selectServerConnection = (state: RootState) =>
  state.connection.serverConnectionModel;

export default serverConnectionSlice.reducer;
