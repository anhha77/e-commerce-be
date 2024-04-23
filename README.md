# E-commerce clothes store web

## Project description

E-commerce clothes store is convenient online platform developed to help customers easily to buy clothes online. It also provides a real-time chat between customer and owner for those who want to know more about the product they intend to buy.

E-commerce clothes store web also provides shop owners with an intuitive interface for owners to manage product in store and add a sale to a product or a specific variant of a product.

## Backend

### Authentication

- [ ] Registering for a new account with name, email and password
- [ ] Signing in with email and password
- [ ] Register quickly with gmail
- [ ] Reset password when forget

### Users

- [ ] User three type: User without sign in, User sign in, Admin

**User without sign in**

- [ ] User can search for a specific product
- [ ] User can filter products on various parameters
- [ ] User can sort products according to price and name
- [ ] User can add products to cart
- [ ] User can order products by providing their shipping information and card detail if the user pay with credit card
- [ ] User can view the feedback of a product
- [ ] User can chat with the shop owner

**User sign in**

- Have all features of user without sign in
- [ ] User can view their order'status and their previous order
- [ ] User can leave feedback, update or delete to the product
- [ ] User can apply code to get the product with the lower price
- [ ] User can change their information like avatar, address, phone number.
- [ ] Withdraw if user pay with credit card

**Admin**

- Have all features of user sign in
- [ ] Can view all product with the quantity of that product
- [ ] Can add, update, delete the product or variant of product
- [ ] Can view orders and update their status
- [ ] Chat with user
- [ ] Create code for discount products or variants
- [ ] Seller dashboard: Sale performance data visualization

## Entity Relationship Diagram

![E-commerce diagram](./ecommerce.drawio.png)

## API Endpoints

## Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Log in with email and password
 * @body {email, password}
 * @access Public
 */
```

```javascript
/**
 * @route POST /users
 * @description User Registration
 * @body {name, email, password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {username, avatarUrl, password, birthOfDate, phoneNumber}
 * @access Login required
 */
```

### Cart APIs

```javascript
/**
 * @route GET /cart/:cartItemId
 * @decription Get detail of a specific product in cart
 * @access Login required
 */
```

```javascript
/**
 * @route POST /cart
 * @description Create a product in user cart
 * @body {userId, productItemId, qty}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /cart/:cartItemId
 * @description Update a product in user cart
 * @body {userId, qty}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /cart/:cartItemId/users/:id
 * @description Delete a product in user
 * @access Login required
 */
```

### Address APIs

```javascript
/**
 * @route GET /address/users/:id
 * @description Get all address of a user
 * @access Login required
 */
```

```javascript
/**
 * @route POST /address
 * @description Create an address of a user
 * @body {userId, addressLocation, country, phoneNumber, isDefault}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /address/:adrressId
 * @description Update an address of a user
 * @body {addressLocation, country, phoneNumber. isDefault}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /address/:addressId
 * @description Delete an address of a user
 * @access Login required
 */
```

### Review APIs

```javascript
/**
 * @route GET reviews/products/:productItemId
 * @description Get all the product reviews
 * @access Public
 */
```

```javascript
/**
 * @route GET reviews/users/:id
 * @description Get all user reviews
 * @access Login required
 */
```

```javascript
/**
 * @route POST /reviews
 * @description Create a review for a product
 * @body {userId, productVariationId, ratingValue, comment, imageUrl}
 * @access Public
 */
```

```javascript
/**
 * @route PUT /reviews/:reviewId
 * @description Update a review of a product
 * @body {ratingValue, comment, imageUrl}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /reviews/:reviewId
 * @description Delete a review
 * @access Login required
 */
```

### Payment method APIs

```javascript
/**
 * @route GET /payment/users/:id
 * @description Get all payment method of user
 * @access Login required
 */
```

```javascript
/**
 * @route POST /payment
 * @description Create a new payment method
 * @body {userId, paymentType, accountNumber, isDefault}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /payment/:paymentId
 * @description Update a payment method
 * @body {accountNumber, isDefault}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /payment/:paymentId
 * @description Delete a payment method
 * @access Login required
 */
```
