class Roles {
  static ADMIN = "admin";
  static USER = "user";
}

class ShippingMethod {
  static Standard = "Standard";
  static Express = "Express";
  static Priority = "Priority";
}

class OrderStatus {
  static Ordered = "Ordered";
  static InTransit = "In Transit";
  static Delivered = "Delivered";
  static Cancelled = "Cancelled";
  static RequestCancelled = "Request Cancelled";
  static Return = "Return";
  static RequestReturn = "Request Return";
}

module.exports = {
  Roles,
  ShippingMethod,
  OrderStatus,
};
