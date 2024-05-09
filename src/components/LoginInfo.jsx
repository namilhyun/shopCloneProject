import { googleLogin, googleLogout, onUserState } from "@/api/api";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function LoginInfo(){
    const [user,setUser] = useState(null)
    // console.log(user)
    // 로그인된 사용자 정보를 받아올 상태값

    const login = async ()=>{
        googleLogin().then(setUser)
        // .then : ?
    }
    
    const logout = async ()=>{
        googleLogout().then(setUser)
        // .then : ?
    }

    useEffect(()=>{
        onUserState((user)=>{
            setUser(user)
        })
    },[])

    return(
        <>
            {user && user.isAdmin &&
                <Link href='/upload' className="uploadBtn">업로드</Link>
            }
            {user ? (
                <>
                    <span>{user.displayName}</span>
                    <button onClick={logout} style={{color:"white"}}>로그아웃</button>
                </>
            ) : (
                <button onClick={login} style={{color:"white"}}>로그인</button>
            )}
        </>
    )
}