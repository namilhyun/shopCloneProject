
import useCart from "@/service/useCart";
import { formatCurrency } from "@/utils/formatCurrency"
import Image from "next/image"
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { removeCart } from "@/api/api";

export default function CartItem({product, index}){

    const {addItemCart, removeItemCart} = useCart();
    
    const plusQuantity = ()=>{
        addItemCart.mutate({...product, quantity : product.quantity + 1})
    } 
    const minusQuantity = ()=>{
        if(product.quantity < 2){
            alert('상품 갯수는 1보다 작을 수 없습니다.')
        }else{
            addItemCart.mutate({...product, quantity : product.quantity - 1})
        }
    }

    const itemDelete = ()=>{
        removeItemCart.mutate(product.id);
    }
    // 아이템 삭제

    return (
        <li>
            <p>{index}</p>
            <Image src={product.image} alt={product.title} width={100} height={100}/>
            <p className="cartItemTitle">상품명 : {product.title}</p>
            <p className="cartItemOpt">옵션 : {product.option}</p>
            <div className="cartItemColor">
                <p>컬러</p> <span style={{backgroundColor : product.color}}></span>
            </div>
            <p className="cartItemPrice">가격 : {formatCurrency(product.price)}</p>
            <div className="cartItemQu">
                <p>수량 : {product.quantity}개</p>
                <button onClick={plusQuantity}><MdOutlineKeyboardArrowUp /></button>
                <button onClick={minusQuantity}><MdOutlineKeyboardArrowDown /></button>
            </div>
            <button className="removeBtn" onClick={()=>itemDelete(product.id)}><IoClose /></button>
        </li>
    )
}