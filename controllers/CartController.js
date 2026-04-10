import Product from "../models/Product.js";

//Termék hozzáadása a kosárhoz
export async function addToCart(req, productId) {
    if (!req.session.cart) {
        req.session.cart = []; //ha nincs még, akkor üres kosár létrehozása
    }
    //benne van-e már a kosárban a termék
    const itemIndex = req.session.cart.findIndex(p => p.id === productId);
    
    //készlet ellenőrzés
    const product = await Product.findById(productId);
    if (!product) throw new Error("Termék nem található");

    if (itemIndex > -1) {
        //ha már benne van, akkor növeljük a mennyiséget
        if (req.session.cart[itemIndex].quantity < product.stock) {
            req.session.cart[itemIndex].quantity += 1;
        }

    } else {
        //ha nincs benne, akkor kikeressük és hozzáadjuk a kosárhoz
        const product = await Product.findById(productId);
        if (product.stock > 0) {
            req.session.cart.push({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
                stock: product.stock
            });
        }
    }
}

//Termék eltávolítása a kosárból
export function removeFromCart(req, productId) {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(p => p.id !== productId); 
    }
}

//Mennyiség növelése
export async function increaseQuantity(req, productId) {
    if (req.session.cart) {
        const itemIndex = req.session.cart.findIndex(p => p.id === String(productId));
        
        if (itemIndex > -1) {
            const item = req.session.cart[itemIndex];
            const product = await Product.findById(productId);

            if (item.quantity < product.stock) {
                req.session.cart[itemIndex].quantity += 1;
            }else {
                console.log('Elérte a maximális készletet!');
            }
        }
    }
}

//Mennyiség csökkentése
export function decreaseQuantity(req, productId) {
    if (req.session.cart) {
        const itemIndex = req.session.cart.findIndex(p => p.id === String(productId));
        
        if (itemIndex > -1 && req.session.cart[itemIndex].quantity > 1) {
            req.session.cart[itemIndex].quantity -= 1;
        }
    }
}