import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAuthState} from "../auth/authSlice";
import {RootState} from "../../app/store";

export interface IEventSocketState {
    socket?: WebSocket
}

const initialState: IEventSocketState = {

}

const eventSocketSlice = createSlice({
    name: 'eventSocket',
    initialState: initialState,
    reducers: {
        connect: (state, action: PayloadAction<IEventSocketState>) => {
            const {socket} = action.payload;
            state.socket = socket;
        },
    }
});

const exportActions = {
    connect: eventSocketSlice.actions.connect,
};

export const { connect } = exportActions;
export default eventSocketSlice.reducer;

export const selectCurrentSocket = (state: RootState) => state.eventSocket.socket;