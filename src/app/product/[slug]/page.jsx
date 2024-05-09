
"use client"
import { getCategoryProduct } from "@/api/api";
import CategoryProductList from "@/components/CategoryProductList";
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import styled from "styled-components";
import NoProduct from "./NoProduct";

// 카테고리별로 아이템을 구분해서 출력
/*
클라이언트 필터링버전
 - 데이터의 양이 적을 때는 상관없지만 데이터의 양이 많을 때에는 클라이언트 필터링이 불리해지는 부분이 생김
 - 모든 데이터를 클라이언트로 전송하려는 로직이기 때문에 클라이언트 자체의 메모리를 사용하기 떄문에 로딩이나 메모리 처리에 과부하의 문제가 생김
 - 데이터의 전송량 문제 : 데이터가 클 수록 네트워크 데이터 사용량이 증가

서버측 필터링으로 대체
 - api서버 자체에서 필터링을 거친 후 결과값만 클라이언트로 전송되기 때문에 데이터의 속도나 사용량에 차이가 많이 생김
 - 데이터의 양이 클수록 클라이언트 필터링 보다는 서버 필터링을 추천
 */
export default function CategoryPage(){
    const pathName = usePathname();

    const slug = pathName.split('/').pop();
    console.log(slug)

    const [products, setProduct] = useState([]);

    useEffect(()=>{
        getCategoryProduct(slug).then((product)=>{
            setProduct(product)
        }).catch((error)=>{
            console.error(error)
        })
    },[slug])
    console.log(products)
    
    return(
        <Container>
            <h2>{slug}페이지</h2>
            {products.length > 0 ? (
                <CategoryProductList slug={slug} products={products}/>
                ) : (
                    <NoProduct/>   
                )
            }
        </Container>
    )
}


const Container = styled.div`
`