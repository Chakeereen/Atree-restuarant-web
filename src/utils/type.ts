// MenuLists
export interface MenuLists {
  menuID: number;
  name: string;
  price: number;
  typeID: number;
  image: string;
  fileID: string;
  isAvailable: boolean;
  
  type?: MenuType;
  details?: OrderDetail[];
}

// MenuType
export interface MenuType {
  typeID: number;
  name: string;
  menus?: MenuLists[];
}

// Table
export interface TableNo {
  tableNo: number;
  locationDetail: string;
  dateTime: Date;
  updateAt: Date;
  orders?: Orders[];
}

// Admin
export interface Admin {
  adminID: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  image: string;
  fileID: string;
  role: string;
  dateTime: Date;
  updateAt: Date;
}

// ServiceState
export interface ServiceState {
  serviceID: number;
  serviceName: string;
  orders?: Orders[];
}

// Orders
export interface Orders {
  orderNo: number;
  tableNO: number;
  serviceID: number;
  dateTime: Date;
  updateAt: Date;
  role: string;
  table?: TableNo;
  service?: ServiceState;
  details?: OrderDetail[];
  payments?: Payment[];
}

// OrderDetail
export interface OrderDetail {
  detailNo: number;
  orderNo: number;
  menuID: number;
  trackOrderID: number;
  amount: number;
  price: number;
  totalCost: number;
  dateTime?: Date;
  updateAT?: Date;
  order?: Orders;
  menu?: MenuLists;
  track?: OrderTrack;
  cancelLog?: CancelOrderLog[];
}

// CancelOrderLog
export interface CancelOrderLog {
  cancelLog: number;
  detailNo: number;
  orderNo: number;
  description: string;
  cancelBy: string;
  createAt: Date;
  detail?: OrderDetail;
}

// OrderTrack
export interface OrderTrack {
  trackOrderID: number;
  trackStateName: string;
  details?: OrderDetail[];
}

// Payment
export interface Payment {
  paymentNo: number;
  orderNo: number;
  totalCost: number;
  dateTime: Date;
  updateAt: Date;
  status: PaymentStatus;
  staffID: string;
  methodID: number;
  order?: Orders;
  staff?: Staff;
  method?: PayMethod;
}

// PaymentStatus
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

// PayMethod
export interface PayMethod {
  methodID: number;
  methodName: string;
  payments?: Payment[];
}

// Staff
export interface Staff {
  staffNo: number;
  staffID: string;
  name: string;
  surname: string;
  telNo: string;
  email: string;
  password: string;
  image?: string;
  fileID?: string;
  role: string;
  dateTime: Date;
  updateAt: Date;
  payments?: Payment[];
  loginLogs?: LoginLog[];
}

// LoginLog
export interface LoginLog {
  logNo: number;
  staffID: string;
  loginResult: string;
  dateTime: Date;
  staff?: Staff;
}

export interface CartItem extends OrderDetail {
  name: string;
  image: string;
}
