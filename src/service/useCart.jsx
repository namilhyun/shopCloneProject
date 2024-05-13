import { getCart, removeCart, updateCart } from "@/api/api";
import { useAuthContext } from "@/context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCart(){
    const {uid} = useAuthContext()
    // 로그인된 사용자 id를 가져옴

    const queryClint = useQueryClient();
    // yarn add @transtack/react-query
    // 서버 상태관리 쿼리문
    // 데이터 동기화, 캐싱, 업데이트를 관리하는 라이브러리

    const cartInfo = useQuery({
        queryKey : ['cart',uid || ''],
        queryFn : ()=> getCart(uid),
        enabled : !!uid
    })

    const addItemCart = useMutation({
        // useMutation : 정보를 업데이트 할 때 사용하는 쿼리 구문
        mutationFn : (product)=>updateCart(uid, product),
        
        onSuccess : ()=>{
        // onSuccess : 완료가 됐으면 이라는 뜻 
            queryClint.invalidateQueries(['cart',uid])
            // 최신상태로 업데이트(쿠키값을 무효화 시켜서 상품의 정보를 최신으로 업데이트 해주는 구문)
        }
    })

    const removeItemCart = useMutation({
        mutationFn : (id)=>removeCart(uid, id),
        onSuccess : ()=>{
            queryClint.invalidateQueries(['cart',uid])
        }
    })

    return {addItemCart, removeItemCart, cartInfo}
}