import express from 'express';
import * as productController from '../controllers/ProductController.js';
import * as cartController from '../controllers/CartController.js';
import * as orderController from '../controllers/OrderController.js';

const router = express.Router();

// Főoldal: összes termék lekérése
router.get('/', async (req, res) => {
    try {
        const products = await productController.getAllProducts();
        res.render('products',{products: products, pageTitle: 'Összes termék'});
    }catch (err) {
        res.status(500).render('error', { message: 'Lekérdezési hiba: ' + err.message });
    }
});

// Készleten lévő termékek
router.get('/instock', async (req, res) => {
    try {
        const products = await productController.getInStockProducts();
        res.render('products', {products: products, pageTitle: 'Raktáron lévő termékek'});
    }catch (err) {
        res.status(500).render('error', { message: 'Lekérdezési hiba: ' + err.message });
    }   
});

// Új termék létrehozása
router.get('/new', (req, res) => {
    res.render('new-product', { pageTitle: 'Új termék létrehozása' });
});

router.post('/add-product', async (req, res) => {
    try {
        await productController.createProduct(req.body);
        res.redirect('/');
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA új termék létrehozása során: ' + err.message });
    }
});


//Termék adatlapja
router.get('/product/:id', async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        res.render('product-detail', { product: product, pageTitle: 'Termék adatlap' });
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék adatlapjának lekérése során: ' + err.message });
    }
});

//Termék törlése
router.post('/product/:id/delete', async (req, res) => {
    try {
        await productController.deleteProduct(req.params.id);
        res.redirect('/');
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék törlése során: ' + err.message });
    }
});

//Termék szerkesztése
router.get('/product/:id/edit', async (req, res) => {
    try {
        const product = await productController.getProductById(req.params.id);
        res.render('edit-product', { product: product, pageTitle: 'Termék szerkesztése' });
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék szerkesztő oldalának lekérése során: ' + err.message });
    }   
});

router.post('/product/:id/edit', async (req, res) => {
    try {
        await productController.updateProduct(req.params.id, req.body);
        res.redirect(`/product/${req.params.id}`);
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék frissítése során: ' + err.message });
    }
});


//Kosár megtekintése
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    //végösszeg kiszámítása
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('cart', { cart: cart, total: total, pageTitle: 'Kosár' });
});

//Hozzáadás a kosárhoz
router.post('/cart/add/:id', async (req, res) => {
    try {
        await cartController.addToCart(req, req.params.id);
        res.redirect('/cart');
    }catch (err) {  
        res.status(500).render('error', { message: 'HIBA termék hozzáadása a kosárhoz: ' + err.message });
    }
});

//Eltávolítás a kosárból
router.post('/cart/remove/:id', (req, res) => {
    try {
        cartController.removeFromCart(req, req.params.id);
        res.redirect('/cart');
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék eltávolítása a kosárból: ' + err.message });
    }
});

//Mennyiség növelése
router.post('/cart/increase/:id', async (req, res) => {
    try {
        await cartController.increaseQuantity(req, req.params.id);
        res.redirect('/cart');
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék mennyiségének növelése: ' + err.message });
    }
});

//Mennyiség csökkentése
router.post('/cart/decrease/:id', (req, res) => {
    try {
        cartController.decreaseQuantity(req, req.params.id);
        res.redirect('/cart');
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA termék mennyiségének csökkentése: ' + err.message });
    }
});

// Keress rá a Routes.js-ben erre a részre:
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.query;
        if (!searchTerm) {
            return res.redirect('/');
        }
        
        const products = await productController.searchProductsByName(searchTerm);
        
        res.render('products', { 
            products: products, 
            pageTitle: `Találatok: "${searchTerm}"` 
        });
    } catch (err) {
        res.status(500).render('error', { message: 'Keresési hiba: ' + err.message });
    }
});

//Rendelés leadása
router.post('/order/place', async (req, res) => {
    try {
        await orderController.placeOrder(req);
        res.render('order-success', { pageTitle: 'Sikeres rendelés!' });
    }catch (err) {
        res.status(500).render('error', { message: 'HIBA rendelés leadása során: ' + err.message });
    }
});

export default router;