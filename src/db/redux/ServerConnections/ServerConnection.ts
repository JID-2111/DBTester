import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DBProvider from '../../entity/enum';
import { ConnectionModel } from '../../Models';
import PgClient from '../../PgClient';
import ServerInterface from '../../ServerInterface';
import { RootState } from '../store';

const model = new ConnectionModel({
  type: DBProvider.PostgreSQL,
  nickname: 'something_dumb',
  connectionConfig: {
    config: 'manual',
    username: 'kpmg',
    password: 'asdf',
    address: 'localhost',
    port: 5432,
  },
});

export interface ServerConnectionState {
  serverConnection: ServerInterface;
}

const initialState: ServerConnectionState = {
  serverConnection: new PgClient(model), // TODO maybe change this later
};

// eslint-disable-next-line import/prefer-default-export
export const serverConnectionSlice = createSlice({
  name: 'serverConnection',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ServerInterface>) => {
      state.serverConnection = action.payload;
    },
  },
});

export const { change } = serverConnectionSlice.actions;

export const selectServerConnection = (state: RootState) =>
  state.connection.serverConnection;

export default serverConnectionSlice.reducer;
