var express = require('express');
var router = express.Router();
const cartController = require('../controller/cartController')
const productController = require('../controller/productController')
const userController = require('../controller/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
// const verifyToken  = require('../authMiddleware')




router.get('/products',productController.getProducts);
router.get('/products/:productId', productController.getProductById);
router.get('/cart/:userId/',cartController.showCartData);
router.get('/cart-count/:userId',cartController.getCartCount);
router.post('/cart/add/:productId',cartController.addToCart);
router.delete('/cart/delete/:productId', cartController.removeFromCart);
router.put('/cart/update/:productId', cartController.updateQuantity);
router.post('/user/register',userController.userRegister);
router.post('/user/login',userController.userLogin);
router.get('/is-authenticated',userController.authenticated);
router.post('/user/logout',userController.userLogout)

module.exports = router;
