
"use client"
import { googleLogin, googleLogout, onUserState } from '@/api/api';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
// context : 컴포넌트 간에 어떤 값들을 고용할 수 있게 해주는 hook
// props는 1단계만 되지만 context는 전부 사용 가능하게 함

export function AuthContextProvider({children}){
    const [user, setUser] = useState();
    const [unSubScribe, setUnSubScribe] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        const storeUser = sessionStorage.getItem('user');
        // sessionStorage : 저장소
        if(storeUser){
            setUser(JSON.parse(storeUser))
        }
        const userChange = (newUser) => {
            setUser(newUser)
            setIsLoading(false)

            if(newUser){
                sessionStorage.setItem('user',JSON.stringify(newUser))
                // 사용자가 로그인하면 세션스토리지에 정보를 저장
            }else{
                sessionStorage.removeItem('user')
                // 로그아웃을 하면 세션 스토리지에 있는 정보를 삭제
            }
        }
        const unSubScribeFun = onUserState(userChange);
            // 위에서 업데이트 된 사용자를 onUserState에 넘김

            setUnSubScribe(()=>unSubScribeFun)
            return()=>{
                if(unSubScribeFun){
                    unSubScribeFun()
                }
            }
    },[])

    return(
        <AuthContext.Provider value={{user, googleLogin, googleLogout, uid:user &&user.uid, isLoading}}>
            {/* 정보를 전부 뿌려놓음 */}
            {children}
        </AuthContext.Provider>
    )
}


export function useAuthContext(){
    return useContext(AuthContext)
}