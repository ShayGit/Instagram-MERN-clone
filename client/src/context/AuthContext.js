import M from "materialize-css";
import createDataContext from "./createDataContext";
import history from "../modules/history";

const authReducer = (state, action) => {
  switch (action.type) {
    // case "SET_USER": {
    //   return { ...state, user: action.payload };
    // }
    case "SET_AUTH": {
      return {...state, ...action.payload, isLoading:false};
    }
    case "UPDATE_FOLLOW": {
      return {...state,user:{...state.user, ...action.payload} };
    }
    case "UPDATE_PHOTO": {
      return {...state,user:{...state.user, image: action.payload} };
    }
    case "SIGNOUT": {
      return {token:"",user:null}
    }
    default:
      return state;
  }
};

const signin = (dispatch) => async ({ username, password }) => {
  try {
    
    const result = await fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        username,
      }),
    });
    const data = await result.json();
    if (data.error) {
      M.toast({ html: data.error, classes: "xc62828 red darken-3" });
    } else {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({ type: "SET_AUTH", payload: {user:data.user,token:data.token }});
      history.push('/');
      M.toast({
        html: "Signed in successfully",
        classes: "x43a047 green darken-1",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const setUserAndToken = (dispatch) => ({ user, token }) => {
  dispatch({ type: "SET_AUTH", payload: { user, token } });

};

const updateUserFollow = (dispatch) => ({ followers,following }) => {
  dispatch({ type: "UPDATE_FOLLOW", payload: { followers,following } });

};
const updateUserPhoto = (dispatch) => (url) => {
  dispatch({ type: "UPDATE_PHOTO", payload: url });

};

const signout = (dispatch) => async() => {
  localStorage.clear();
  dispatch({ type: "SIGNOUT"});
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    setUserAndToken,
    updateUserFollow,
    updateUserPhoto
   },
  {
    token: "",
    user: null, 
    isLoading: true
  }
);
