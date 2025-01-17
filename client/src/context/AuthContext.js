import { createContext, useEffect, useReducer } from "react";



const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    // If there's no email, return null without trying to parse
    return null;
  }
  try {
    // Only parse if email is truthy
    localStorage.setItem('loginTime', Date.now().toString());
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing email from localStorage", error);
    // Return null or a default value if parsing fails
    return null;
  }
};

const INITIAL_STATE = {
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};