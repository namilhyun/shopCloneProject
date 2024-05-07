import { googleLogin, googleLogout } from "@/api/api";
import { useState } from "react";


export default function LoginInfo(){
    const [user,setUser] = useState(null)
    // 로그인된 사용자 정보를 받아올 상태값

    const login = async ()=>{
        googleLogin().then(setUser)
        // .then : ?
    }
    
    const logout = async ()=>{
        googleLogout().then(setUser)
        // .then : ?
    }

    return(
        <>
            {user ? (
                <>
                    <span>{user.displayName}</span>
                    <button onClick={logout} style={{color:"white"}}>로그아웃</button>
                </>
            ) : (
                <button onClick={login}>로그인</button>
            )}
        </>
    )
}