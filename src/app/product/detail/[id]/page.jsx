
"use client"
import { getProductId, googleLogin } from "@/api/api";
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthContext } from "@/context/authContext";
import useCart from "@/service/useCart";

export default function ProductDtailPage(){
    const {addItemCart} = useCart();
    const {user} = useAuthContext();
    // 먼저 임포트를 한 뒤에 그 안에있는 함수를 가져오는 구문

    const pathName = usePathname();
    // 현재 경로의 주소
    const id = pathName.split('/').pop();
    // console.log(id)

    const [product, setProduct] = useState(null);

    const [selected, setSelected] = useState();
    const [selectedColor, setSelectedColor] = useState();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        if(!id){
            setError('제품 정보를 찾을 수 없습니다.')
            setIsLoading(false);
            return
        }
        const fetchData = async () => {
            try{
                const data = await getProductId(id)
                if(data){
                    setProduct(data)
                }else{
                    setError('제품이 없습니다.')
                }
            }catch(error){
                console.error(error)
            }finally{
                setIsLoading(false);
            }
        }
        fetchData();
    },[id])

    const selectOpt = (e)=>{
        setSelected(e.target.value)
    }
    const selectColor = (color)=>{
        setSelectedColor(color)
    }

    const handleActionClick = (type) => {
        if(!user){
            alert('로그인이 필요합니다')
            // alert : 프롬프트창
            googleLogin()
            return
        }

        if(!selectedColor || !selected){
            alert('옵션이 선택되지 않았습니다.')
            return
        }

        if(type === '장바구니'){
            const productToAdd = {
                id : product.id,
                title : product.title,
                price : product.price,
                image : product.img,
                option : selected,
                color : selectedColor,
                quantity : 1
            }
            addItemCart.mutate(productToAdd,{
                onSuccess : ()=>{
                    alert('장바구니에 추가되었습니다.')
                },
                onError : (error)=>{
                    alert('장바구니 추가에 실패했습니다.')
                    console.error(error)
                }
            })
        }


        // const {image, title, price} = product;
        // const itemAddOption = {
        //     id,
        //     image,
        //     title,
        //     price,
        //     option : selected,
        //     color : selectedColor,
        //     quantity : 1
        //     // quantity : 수량
        // }
        // addItemCart(itemAddOption);
    }

    if(isLoading) return <p>로딩중입니다.</p>
    if(error) return <p>{error}</p>
    if(!product) return <p>제품이 없습니다.</p>

    return (
        <DetailPage>
            <div className="detailImg">
                <img src={product.img} alt={product.id}/>
            </div>
            <div className="detailTextWrap">
                <h3>{product.title}</h3>
                <p className="price">가격 : <span>{formatCurrency(product.price)}원</span></p>

                <div className="detailOpt">
                    <label className="labelText" htmlFor="optSelect">옵션</label>
                    {/* 리액트에서는 label에서 for대신 htmlFor로 사용한다. */}
                    <select id="optSelect" value={selected} onChange={selectOpt}>
                        {product?.option?.split(',').map((opt, index)=>(
                            <option key={index} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div className="detailColors">
                    <p>색상 선택</p>
                    {product?.colors?.map((opt,index)=>(
                        <div 
                            className="colorChip" 
                            key={index} 
                            style={{backgroundColor : opt}}
                            onClick={()=>selectColor(opt)}
                            />
                    ))}
                </div>
                <div className="detailBtns">
                    <button className="cartBtn" onClick={()=>handleActionClick('장바구니')}>장바구니 담기</button>
                    <button className="buyBtn" onClick={()=>handleActionClick('구매')}>구매하기</button>
                </div>
            </div>
        </DetailPage>
    )
}

const DetailPage = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 0px;
    display: flex;
    gap: 40px;
    color: #fff;
    .detailImg{
        max-width: 800px;
        width: 100%;
        img{
            width: 100%;
            display: block;
        }
    }
    .detailTextWrap{
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        max-width: 400px;
        h3{
            font-size: 24px;
            color: #fff;
            font-weight: normal;
            border-bottom: 1px solid rgba(255,255,255,0.1) ;
            padding-bottom: 20px;
            margin-bottom: 100px;
            
        }
        .price{
            display: flex;
            align-items: center;
            gap: 30px;
            color: rgba(255,255,255,0.8);
            span{
                color: rgba(255,255,255,1);
            }
        }
        .detailOpt{
            display: flex;
            gap: 30px;
            select{
                width: 80%;
                padding: 6px;
                background-color: transparent;
                option{
                    background: white;
                }
            }
        }
        .detailColors{
            display: flex;
            gap: 10px;
            height: 20px;
            .colorChip{
                width: 20px;
            }
        }
        .detailBtns{
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            button{
                width: 100%;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                cursor: pointer;
                border: none;
                background: transparent;
                font-weight: bold;
                &.cartBtn{
                    background: lightblue;
                }
                &.buyBtn{
                    background: white;
                }
            }
        }
    }
`