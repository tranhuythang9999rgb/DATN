import React, { useState } from 'react';

const OrderSummary = () => {
  const [quantity, setQuantity] = useState(2);
  const [promoCode, setPromoCode] = useState('');
  const itemPrice = 204000;
  const discount = 72000;
  const total = quantity * itemPrice - discount;

  return (
    <div className="w-full max-w-md mx-auto bg-[#fdf5e6] p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">
        Đơn hàng ({quantity} sản phẩm) {total.toLocaleString()}đ
      </h2>
      
      <div className="mb-4">
        <img src="/api/placeholder/50/50" alt="Product" className="w-12 h-12 object-cover float-left mr-2" />
        <div>
          <h3 className="font-bold">LƯỢC SỬ HOA KỲ</h3>
          <p className="text-sm">Giảm 15% so với giá bìa (-72.000đ)</p>
          <p className="font-bold">{(quantity * itemPrice).toLocaleString()}đ</p>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border px-2 py-1">
          -
        </button>
        <span className="mx-2">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="border px-2 py-1">
          +
        </button>
      </div>
      
      <div className="flex mb-4">
        <input 
          type="text" 
          placeholder="Nhập mã giảm giá" 
          className="flex-grow p-2 border"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          Áp dụng
        </button>
      </div>
      
      <div>
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{(quantity * itemPrice).toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>-</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Tổng cộng</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;