import Image from "next/image";
import styles from "./page.module.css";
import ProductPage from "./product/page";
import MainCategoryList from "@/components/MainCategoryList";

export default function Home() {
  return (
    <main>
      <ProductPage/> 
      {/* 전체목록 */}
      <MainCategoryList category='top'/>
      {/* category에 내가 넣고싶은 옵션명을 넣으면 되게 만듬 */}
      <MainCategoryList category='bottom'/>
    </main>
  );
}
