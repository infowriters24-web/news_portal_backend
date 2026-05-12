import decode_token from "@/utils/index";
const storeReducer = (state, action) => {
    const {type, payload} = action;

    if(type === "login success"){
        return {
            ...state,
            token: payload.token,
            userinfo: decode_token(payload.token)
        }
        
    }
    if(type === "logout"){
        return {
            ...state,
            token: '',
            userinfo: null
        }
    }
    return state;
}


export default storeReducer