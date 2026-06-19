import { OrderSchemaType } from "@repo/order-db";

export type FulfillmentStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderType = OrderSchemaType & {
  _id: string;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};

export type OrderSummaryType = {
  totalOrders: number;
  totalRevenue: number;
  pendingShipments: number;
  deliveredOrders: number;
};
