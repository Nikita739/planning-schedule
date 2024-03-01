import React, {PropsWithChildren, ReactNode, useEffect} from 'react';
import {IUser, selectCurrentUser} from "../../features/auth/authSlice";
import {store} from "../../app/store";
import {connect} from "../../features/eventSocket/eventSocketSlice";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import Push from 'push.js';

interface Props {
    children: ReactNode;
    user: IUser | null
}

interface BroadcastResponse {
    type: string;
    content: any
}

const EventsBroadcastConnect = ({children, user}: Props) => {
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        if(!user) return;

        const eventSocket = new WebSocket("ws://localhost:4040");

        eventSocket.onmessage = (ev) => {
            console.log(ev.data);
            const res: BroadcastResponse = JSON.parse(ev.data);
            if(res.type === "testResponse") {
                Push.create(res.content.message);
            }
        }

        setTimeout(() => {
            const loginEventData = {
                id: user.id
            }
            eventSocket.send(JSON.stringify(loginEventData));
        }, 50);

        dispatch(connect({socket: eventSocket}));
    }, [user]);

    return (
        <div>
            {children}
        </div>
    );
};

export default EventsBroadcastConnect;