import { createContext } from "react";


export const CategoryContext = createContext({
    categoryList : ['top', 'bottom', 'outer', 'accessory', 'shose', 'etc']
    
})

// 메뉴를 추가,삭제를 편하게 하기 위함