import { useEffect, useState } from "react";
import Product from "./Product";

export default function CategoryProductList({slug, products}){
    const [product, setProducts] = useState(products)
    useEffect(()=>{
        setProducts(products)
    },[products])

    return (
        <>
            <h3>{slug}</h3>
            <Product products={product}/>
        </>
    )
}