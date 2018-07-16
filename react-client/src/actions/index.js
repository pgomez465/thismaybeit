// src/js/actions/index.js
import { SET_ROOMID, SET_USERNAME, ADD_MESSAGE, SET_MESSAGE, MUTE, RESET } from "../constants/action-types";

export const setRoomId = roomId => ({ type: SET_ROOMID, payload: roomId });
export const setUserName = username => ({ type: SET_USERNAME, payload: username });
export const addMessage = message => ({ type: ADD_MESSAGE, payload: message });
export const setMessage = message => ({ type: SET_MESSAGE, payload: message });
export const Mute = toggle => ({ type: MUTE, payload: toggle });
export const reset = () =>({ type: RESET });
