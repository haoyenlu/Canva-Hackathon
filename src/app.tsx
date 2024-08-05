import { useState } from "react";

import { GenerateLogoPage } from "./first";
import { SelectImagePage } from "./second";




export const App = () => {

  const [page,setPage] = useState<number>(0);


  const goToNextPage = () => {
    const curPage = page;
    setPage(curPage + 1);
  }

  const goToPreviousPage = () => {
    const curPage = page;
    setPage(curPage - 1);
  }


  function switchPages() {
    console.log(page);
    switch(page) {
      case 0:
        return <GenerateLogoPage 
                goToNextPage = {goToNextPage}
                />
      case 1:
        return <SelectImagePage 
                goToPreviousPage={goToPreviousPage}/>
    }
  }


  return (
    <div>
      {switchPages()}
    </div>
  )
};
