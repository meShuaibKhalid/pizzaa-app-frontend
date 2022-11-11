export interface OrderI {
  id?: string;
  customerId: string;
  customerName: string;
  items: any;
  deliveryET: string;
  deliveryAT?: string;
  address: string;
  status?: string;
  price: number;
  comment?: string;
}
