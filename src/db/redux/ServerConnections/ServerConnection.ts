import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DBProvider from '../../entity/enum';
import { ConnectionModelType } from '../../models/ConnectionModels';
import PgClient from '../../PgClient';
import ServerInterface from '../../ServerInterface';
import { RootState } from '../store';

const model: ConnectionModelType = {
  type: DBProvider.PostgreSQL,
  nickname: 'something_dumb',
  connectionConfig: {
    config: 'manual',
    username: 'kpmg',
    password: 'asdf',
    address: 'localhost',
    port: 5432,
  },
};

export interface ServerConnectionState {
  serverConnection: ServerInterface;
  valid: boolean;
}

const initialState: ServerConnectionState = {
  serverConnection: new PgClient(model), // TODO maybe change this later
  valid: process.env.NODE_ENV !== 'production', // TODO change this to false later
};

// eslint-disable-next-line import/prefer-default-export
export const serverConnectionSlice = createSlice({
  name: 'serverConnection',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ServerInterface>) => {
      state.serverConnection = action.payload;
      state.valid = true;
    },
    clear: (state) => {
      state.valid = false;
    },
    setDB: (state, action: PayloadAction<string>) => {
      state.valid = true;
      state.serverConnection = new PgClient(
        state.serverConnection.model,
        action.payload
      ) as ServerInterface;
    },
  },
});

export const { change, clear, setDB } = serverConnectionSlice.actions;

export const selectServerConnection = (state: RootState) =>
  state.connection.serverConnection;

export default serverConnectionSlice.reducer;
