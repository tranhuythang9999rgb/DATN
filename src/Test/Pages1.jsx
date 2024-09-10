import React, { useState } from 'react';
import BookWellSell from '../Home/BookWellSell';
import HomePage from '../Home/HomePage';

function Pages1() {
    const [isNext, setIsNext] = useState(false);

    if (isNext) {
        return <HomePage />;
    }

    return (
        <div style={{ padding: 20 }}>
            <BookWellSell title={"Sách Hay"} onEventClick={() => setIsNext(true)} />
        </div>
    );
}

export default Pages1;
