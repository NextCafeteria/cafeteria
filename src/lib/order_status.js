export const OrderStatus = {
  QUEUED: "queued",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
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
