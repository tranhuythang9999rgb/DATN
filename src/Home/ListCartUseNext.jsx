import { useState } from "react";
import ListCart from "../user/ListCart";
import FormBuyCart from "../user/FormBuyCart";

function ListCartUseNext() {

    const [isNextListWhenBuy,setIsNextListWhenBuy] = useState(false);
   

    if(isNextListWhenBuy) {
        return (
           <FormBuyCart/>
        )
    }


    return (
        <div>
            <ListCart  onEventClick={()=>setIsNextListWhenBuy(true)}/>
        </div>
    );
}

export default ListCartUseNext;
