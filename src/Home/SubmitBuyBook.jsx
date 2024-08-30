import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import DetailBuy from './DetailBuy';


const SubmitBuyBook = () => {

    const [isGoback,setIsGoback] = useState(false);
    const handleNextSubmitBuy = () =>{
        setIsGoback(true);
    }

    if(isGoback) {
        return(
            <DetailBuy book_id={localStorage.getItem('book_id')}/>
        )
    }
    return (
        <div style={{ padding: '20px' }}>
            <Button onClick={handleNextSubmitBuy}>Quay lại</Button>
        </div>
    );
};


export default SubmitBuyBook;
