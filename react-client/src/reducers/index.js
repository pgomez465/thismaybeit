import { SET_ROOMID, SET_USERNAME, ADD_MESSAGE, SET_MESSAGE, MUTE , RESET} from "../constants/action-types";
const initialState = {
  roomId: "",
  userName: "",
  messages: [],
  message: "",
  mute: false
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOMID:
      return { ...state, roomId: action.payload };
    case SET_USERNAME:
      return { ...state, userName: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case SET_MESSAGE:
      return { ...state, message: action.payload };
    case MUTE:
      return { ...state, mute: !state.mute };
    case RESET:
      return initialState;
    default:
      return state;
  }
};
export default rootReducer;
