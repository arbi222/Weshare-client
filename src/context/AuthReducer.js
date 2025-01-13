const AuthReducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return {
                user: null,
                accessToken: null,
                askingForTwoFaCode: false,
                isFetching: true,
                error: false,
            };
        case "VERIFY_2FA":
            return {
                user: action.payload.user,
                accessToken: null,
                askingForTwoFaCode: action.payload.askingForTwoFaCode,
                isFetching: false,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload.userInfo,
                accessToken: action.payload.accessToken,
                askingForTwoFaCode: false,
                isFetching: false,
                error: false,
            };
        case "REFRESHING_TOKEN":
            return {
                ...state,
                accessToken: action.payload.accessToken,
            };  
        case "LOGIN_FAILURE":
            return {
                user: null,
                accessToken: null,
                askingForTwoFaCode: false,
                isFetching: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                user: null,
                accessToken: null,
                askingForTwoFaCode: false,
                isFetching : false,
                error: false
            };    
        case "ADDFRIEND":
            return {
                ...state,
                user: {
                    ...state.user,
                    friends: [...state.user.friends, action.payload],
                    friendRequests: state.user.friendRequests.filter(
                        (friend) => friend !== action.payload)
                }
            };
        case "REMOVEFRIEND":
            return {
                ...state,
                user: {
                    ...state.user,
                    friends: state.user.friends.filter(
                        (friend) => friend !== action.payload)
                }
            };
        case "DECLINEFRIENDREQUEST":
            return {
                ...state,
                user: {
                    ...state.user,
                    friendRequests: state.user.friendRequests.filter(
                        (friend) => friend !== action.payload)
                }
            };
        case "BLOCKUSER":
            return {
                ...state,
                user: {
                    ...state.user,
                    blockList: [...state.user.blockList, action.payload]
                }
            };
        case "UNBLOCKUSER":
            return {
                ...state,
                user: {
                    ...state.user,
                    blockList: state.user.blockList.filter(
                        (friend) => friend !== action.payload)
                }
            };
        default:
            return state
    }
}

export default AuthReducer;