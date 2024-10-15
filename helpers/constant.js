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

class CategoryType {
  static GenderCategory = "Gender Category";
  static GeneralCategory = "General Category";
  static SubCategory = "Sub Category";
}

class GenderCategory {
  static Boys = "Boys";
  static Girls = "Girls";
}

class GeneralCategory {
  static TopWear = "Topwear";
  static BottomWear = "BottomWear";
  static Dress = "Dress";
  static InnerWear = "Innerwear";
  static Socks = "Socks";
  static ApparelSet = "Apparel Set";
}

class SubCategory {
  static Tops = "Tops";
  static Tshirts = "Tshirts";
  static Rompers = "Rompers";
  static LehengaCholi = "Lehenga Choli";
  static Shirts = "Shirts";
  static Jackets = "Jackets";
  static Kurtas = "Kurtas";
  static Sweatshirts = "Sweatshirts";
  static Waistcoat = "Waistcoat";
  static Blazers = "Blazers";
  static Capris = "Capris";
  static Shorts = "Shorts";
  static Skirts = "Skirts";
  static Jeans = "Jeans";
  static Leggings = "Leggings";
  static Salwar = "Salwar";
  static Trousers = "Trousers";
  static Churidar = "Churidar";
  static Dresses = "Dresses";
  static InnerwearVests = "Innerwear Vests";
  static Booties = "Booties";
  static ClothingSet = "Clothing Set";
  static KurtaSets = "Kurta Sets";
}

module.exports = {
  Roles,
  ShippingMethod,
  OrderStatus,
  CategoryType,
  GenderCategory,
  GeneralCategory,
  SubCategory,
};
