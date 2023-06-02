export const OrderStatus = {
  QUEUED: "queued",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const OrderStatusType = {
  NEW: "new",
  PROCESSING: "processing",
  INACTIVE: "inactive",
};

export const ORDER_STATUS_TYPE_TO_ORDER_STATUS = {
  [OrderStatusType.NEW]: [OrderStatus.QUEUED],
  [OrderStatusType.PROCESSING]: [OrderStatus.CONFIRMED, OrderStatus.PREPARING],
  [OrderStatusType.INACTIVE]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
};

export const ORDER_STATUS_TO_BG_COLOR = {
  [OrderStatus.QUEUED]: "#ffdf63",
  [OrderStatus.CONFIRMED]: "#ffb363",
  [OrderStatus.PREPARING]: "#97ff63",
  [OrderStatus.COMPLETED]: "#5bbdff",
  [OrderStatus.CANCELLED]: "#ff8c8c",
};

export const ORDER_STATUS_TO_TEXT = {
  [OrderStatus.QUEUED]: "Queued",
  [OrderStatus.CONFIRMED]: "Confirmed",
  [OrderStatus.PREPARING]: "Preparing",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_TO_PRIMARY_ACTION = {
  [OrderStatus.QUEUED]: "Process >>",
  [OrderStatus.CONFIRMED]: "Prepare",
  [OrderStatus.PREPARING]: "Complete",
};
