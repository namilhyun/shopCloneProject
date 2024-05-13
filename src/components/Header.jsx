
"use client"
// nextjs13버전부터 생긴 요소로 컴포넌트가 클라이언트 측에서만 실행되도록 조건을 설정

import Link from "next/link"
import styled from "styled-components"
import LoginInfo from "./LoginInfo"
import MainMenu from "./MainMenu"
import { IoCartOutline } from "react-icons/io5";
import { useAuthContext } from "@/context/authContext"
import { googleLogin } from "@/api/api"

export default function Header(){
    const {user} = useAuthContext()

    const handleCartClick = (e)=>{
        if(!user){
            e.preventDefault();
            googleLogin();
        }
    }

    return (
        <HeaderContainer>
            <h1 className="logo">
                <Link href='/'>shop</Link>
            </h1>
            <MainMenu/>
            <LoginInfo/>
            <Link href='/cart' onClick={handleCartClick}><IoCartOutline /></Link>
        </HeaderContainer>
    )
}
const HeaderContainer = styled.header`
    width: 100%;
    padding: 12px 24px;
    box-sizing: border-box;
    border-bottom: 1px solid gray;
    display: flex;
    justify-content: space-between;
    color: #fff;
`