import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionModel, ConnectionModelType } from '../../Models';
import { RootState } from '../store';

export interface ServerConnectionState {
  serverConnectionModel: ConnectionModelType;
  database: string;
}

const initialState: ServerConnectionState = {
  serverConnectionModel: new ConnectionModel(), // TODO maybe change this later
  database: '',
};

// eslint-disable-next-line import/prefer-default-export
export const serverConnectionSlice = createSlice({
  name: 'serverConnection',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<ConnectionModelType>) => {
      state.serverConnectionModel = action.payload;
    },
    clear: (state) => {
      state.serverConnectionModel = new ConnectionModel();
      state.database = '';
    },
    setDB: (state, action: PayloadAction<string>) => {
      state.database = action.payload;
    },
  },
});

export const { change, clear, setDB } = serverConnectionSlice.actions;

export const selectServerConnection = (state: RootState) =>
  state.connection.serverConnectionModel;

export default serverConnectionSlice.reducer;
