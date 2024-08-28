import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null
}

export const AuthContext = createContext(INITIAL_STATE)

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload
            }
        case "LOGIN_FAILURE":
            return {
                user: null
            }
        case "LOGIN_OUT":
            return {
                user: null
            }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}