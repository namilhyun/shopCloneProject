import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase, ref as databaseRef, set, get, query, orderByChild, equalTo, remove } from "firebase/database";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { adminUser } from "@/service/admin";
import { v4 as uuid } from 'uuid'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_API_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_API_AUTH_PROJECT_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
};
// firebaseConfig : firebase 프로젝트 설정값 객체 api키, 도메인 인증, 데이터베이스 키값...

const app = initializeApp(firebaseConfig); // firebaseConfig를 기반으로 firebase설정 값을 초기화
const auth = getAuth(app); // 초기화된 앱을 기반으로 firebase인증 객체 생성 (사용자 인증 관리)
const provider = new GoogleAuthProvider(); // google로그인 기능을 사용할 때 추가하는 프로바이더 객체 생성
const database = getDatabase(); // 초기화된 앱을 기반으로 firebase 데이터베이스 객체 생성
const storage = getStorage();

provider.setCustomParameters({
    // setCustomParameters : 인증 요청에 대한 사용자 정의 파라메터값을 설정
    prompt : 'select_account'
    // prompt : 'select_account' : 계정을 선택할 수 있게 해주는 코드
})
// 자동 로그인 방지

export async function googleLogin(){
    try{
        const result = await signInWithPopup(auth,provider)
        // signInWithPopup(auth,provider) : firebase 자체에 있는 인증 객체
        // provider를 인자로 받아서 google계정을 연동해서 로그인 할 수 있게 하는 메서드
        const user = result.user;
        // console.log(user)
        return user;
    }catch (error){
        console.error(error)
    }
}
// 구글 로그인

export async function googleLogout(){
    try{
        await signOut(auth);
    }catch (error){
        console.error(error)
    }
}
// 구글 로그아웃

export function onUserState(callback){
    onAuthStateChanged(auth,async(user)=>{
    // onAuthStateChanged : 사용자 인증 상태 변화 체크하는 파이어베이스 훅
        if(user){
            try{
                const updataUser = await adminUser(user);
                callback(updataUser)
            }catch(error){
                console.error(error)
                callback(user)
            }
        }else{
            callback(null)
        }
    })
}
// 로그인 유지(새로고침 해도 로그인 유지)

export async function uploadImg(file) {
    try {
        const id = uuid();
        const imgRef = storageRef(storage, `imges/${id}`)
        // console.log(imgRef)
        await uploadBytes(imgRef, file)
        const imgUrl = await getDownloadURL(imgRef)
        return imgUrl
    }catch(error){
        console.error(error)
    }
}

export async function addProducts(product, imgUrl){
    try{
        const id = uuid();
        await set(databaseRef(database, `products/${id}`),{
            ...product,
            id,
            img : imgUrl,
            price : parseInt(product.price)
        })
    }catch(error){
        console.error(error)
    }
}
// 이미지 링크와 함께 상품을 데이터베이스에 등록

export async function getProducts(){
    try{
        const snapshot = await get(databaseRef(database,'products'));
        if(snapshot.exists()){
            return Object.values(snapshot.val())
        }else{
            return []
        }
    }catch(error){
        console.error(error)
        return []
    }
}
// 데이터베이스에 등록된 상품 리스트를 가져오기

/*
클라이언트 필터링버전
export async function getCategoryProduct(category){
    try{
        return get(databaseRef(database,'products')).then((snapshot)=>{
            if(snapshot.exists()){
                const allProduct = Object.values(snapshot.val());
                const filterProduct = allProduct.filter((product)=>product.category === category)
                return filterProduct
            }else{
                return []
            }
        })
    }catch(error){
        console.error(error)
        return []
    }
}
*/

//서버측 필터링
export async function getCategoryProduct(category){
    try{
        const productRef = databaseRef(database, 'products');

        // category를 기준으로 쿼리를 생성하고 주어진 값이 전송받은 category와 같은 값만 조회
        const q = query(productRef,orderByChild('category'), equalTo(category))
        const snapshot = await get(q);
        if(snapshot.exists()){
            return Object.values(snapshot.val())
        }else{
            return [];
        }
    }catch(error){
        console.error(error)
        return []
    }
}

export async function getProductId(productId){
    try{
        const productRef = databaseRef(database, `products/${productId}`)
        const snapshot = await get(productRef)
        if(snapshot.exists()){
            return snapshot.val()
        }
    }catch(error){
        console.error(error);
    }
}
// 디테일 페이지에서 전달받은 제품 id를 이용해서 database에 있는 동일한 id의 제품과 매칭

export async function getCart(userId){
    try{
        const snapshot = await (get(databaseRef(database,`cart/${userId}`)))
        if(snapshot.exists()){
            const item = snapshot.val();
            return Object.values(item)
        }else{
            return []
        }
    }catch(error){
        console.error(error);
    }
}

export async function updateCart(userId, product){
    if(!userId || !product || !product.id){
        console.error(error);
        return
    }
    try{
        const cartRef = databaseRef(database,`cart/${userId}/${product.id}`)
        console.log(product)
        await set(cartRef, product);
        
    }catch(error){
        console.error(error);
    }
}

export async function removeCart(userId, productId){
    return remove (databaseRef(database,`cart/${userId}/${productId}`));
}

export { database }