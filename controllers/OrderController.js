import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function placeOrder(req, res) {
    const cart = req.session.cart;

    if (!cart || cart.length === 0) {
        return res.status(400).send('A kosár üres.');
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
// Rendelés mentése
    const newOrder = new Order({
        items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        totalAmount: totalAmount
    });

    await newOrder.save();

//Raktár frissítése minden terméknél
    for (const item of cart) {
        await Product.findByIdAndUpdate(item.id, {
             $inc: { stock: -item.quantity } 
        });
    }

//Kosár ürítése
    req.session.cart = [];

    return newOrder;
}
