
"use client"
// nextjs13버전부터 생긴 요소로 컴포넌트가 클라이언트 측에서만 실행되도록 조건을 설정

import { getProducts } from "@/api/api";
import Product from "@/components/Product";
import { useEffect, useState } from "react";
import styled from "styled-components";


export default function ProductPage(){
    const [product, setProduct] = useState([]);

    useEffect(()=>{
        const fetchProducts = async()=>{
            try{
                const products = await getProducts();
                // console.log(products)
                setProduct(products)
            }catch(error){
                console.error(error)
            }
        }
        fetchProducts()
    },[])

    return(
        <Container>
            <Product products={product}/>
        </Container>
    )
}

const Container = styled.div`
    max-width: 1200px;
    width: 100%;
    margin: 0px auto;
    padding: 50px 0px;
`