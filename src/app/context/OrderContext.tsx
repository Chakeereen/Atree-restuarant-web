"use client";

import { createContext, useContext } from "react";

export type OrderInfo = {
  orderNo: number;
  tableNo: number;
};

const OrderContext = createContext<OrderInfo | null>(null);

export const OrderProvider = ({
  orderInfo,
  children,
}: {
  orderInfo: OrderInfo;
  children: React.ReactNode;
}) => {
  return (
    <OrderContext.Provider value={orderInfo}>{children}</OrderContext.Provider>
  );
};

export const useOrderInfo = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderInfo must be used inside OrderProvider");
  }
  return context;
};
