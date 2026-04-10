import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: [0, "Az ár nem lehet negatív!"]},
    category: {type: String, required: true, enum: ['Monitor', 'Egér', 'Billentyűzet', 'Fejhallgató', 'Egyéb']},
    stock: {type: Number, required: true, min: [0, "A készlet nem lehet negatív!"], default: 0},
    imageUrl: {type: String, default: "https://via.placeholder.com/150"}
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export async function initaizeProduct() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const defaultProducts = [
                {
                    name: 'Samsung monitor',
                    description: '27 colos, 4K felbontású monitor',
                    price: 150000,
                    category: 'Monitor',
                    stock: 10,
                    imageUrl: 'https://media.icdn.hu/product/2024-07/620343/1662818_samsung-viewfinity-s8-s80d-27-ls27d800eauxen.webp'
                },
                {
                    name: 'Logitech egér',
                    description: 'Vezeték nélküli egér, ergonomikus kialakítás',
                    price: 15000,
                    category: 'Egér',
                    stock: 25,
                    imageUrl: 'https://media.icdn.hu/product/2022-01/742799/2182420_logitech-m650-l-signiture-vezetek-nelkuli-eger-bluetooth-wireless---grafitszurke.webp'
                },
                {
                    name: 'Corsair billentyűzet',
                    description: 'RGB világítású mechanikus billentyűzet',
                    price: 30000,
                    category: 'Billentyűzet',
                    stock: 15, 
                    imageUrl: 'https://media.icdn.hu/product/2021-04/693249/1623968_corsair_k55_rgb_pro_us_angol_fekete.webp'
                }
            ];
            await Product.insertMany(defaultProducts);
            console.log("Alapértelmezett termékek elmentve az adatbázisba!");
        } else {
            console.log("Már vannak termékek az adatbázisban, nem adunk hozzá újakat.");
        }
    } catch (err) {
        console.error("HIBA a termék inicializálása során:", err);
    }
}

export default Product;