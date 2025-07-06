import React, { createContext, useContext, useState } from 'react';

const CouponContext = createContext();

export function useCoupon() {
  return useContext(CouponContext);
}

export function CouponProvider({ children }) {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  return (
    <CouponContext.Provider value={{ appliedCoupon, setAppliedCoupon, discountAmount, setDiscountAmount }}>
      {children}
    </CouponContext.Provider>
  );
}
