import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionModel } from '../../Models';
import PgClient from '../../PgClient';
import ServerConnection from '../../ServerConnection';
import { RootState } from '../store';

const model = new ConnectionModel();
model.nickname = 'something_dumb';
model.username = 'kpmg';
model.password = 'asdf';
model.address = 'localhost';

export interface ServerConnectionState {
  serverConnection: ServerConnection;
  valid: boolean;
}

const initialState: ServerConnectionState = {
  serverConnection: new PgClient(model), // TODO maybe change this later
  valid: true, // TODO change this to false later
};

// eslint-disable-next-line import/prefer-default-export
export const serverConnectionSlice = createSlice({
  name: 'serverConnection',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ServerConnection>) => {
      state.serverConnection = action.payload;
      state.valid = true;
    },
    clear: (state) => {
      state.valid = false;
    },
  },
});

export const { change, clear } = serverConnectionSlice.actions;

export const selectServerConnection = (state: RootState) =>
  state.connection.serverConnection;

export default serverConnectionSlice.reducer;
