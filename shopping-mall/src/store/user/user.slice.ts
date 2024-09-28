import { createSlice } from "@reduxjs/toolkit";

//리덕스 스토어 기본 데이터를 만드는 부분
const initialState = localStorage.getItem('user') ?
    JSON.parse(localStorage.getItem('user') || "") : { email: "", token: "", id: "" }

    //slice 만드는 부분
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {    
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
            //localStorage에 저장
            localStorage.setItem('user', JSON.stringify(state));
        },
        removeUser: (state) => {
            state.email = "";
            state.token = "";
            state.id = "";

            localStorage.setItem('user', JSON.stringify(state));
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;