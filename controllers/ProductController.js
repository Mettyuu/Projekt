import Product from "../models/Product.js";

// Termékek lekérése az adatbázisból
export async function getAllProducts() {
    try {
        const products = await Product.find();
        return products;
    }catch (err) {
        console.error("HIBA a termékek lekérése során!", err);
        throw new Error("Nem sikerült lekérni a termékeket!");
    }
}

// (CSAK) Készleten lévő termékek lekérése
export async function getInStockProducts() {
    try {
        const InStockProducts = await Product.find({ stock: { $gt: 0 } });
        return InStockProducts;
    }catch (err) {
        console.error("HIBA a készleten lévő termékek lekérése során!", err);
        throw new Error("Nem sikerült lekérni a készleten lévő termékeket!");
    }
}

// ID alapú lekérés
export async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error("Nincs ilyen termék!");
        }
        return product;
    }catch (err) {
        console.error(`HIBA a(z) ${id} azonosítójú termék lekérése során!`, err);
        throw new Error("Nem sikerült lekérni a terméket ID alapján!");
    }
}

// Új termék létrehozása
export async function createProduct(productData) {
    try {
        const newProduct = await Product.create(productData);
        return newProduct;
    }catch (err) {
        console.error("HIBA új termék létrehozása során!", err);
        throw new Error("Nem sikerült létrehozni az új terméket!");
    }
}

//Termék törlése
export async function deleteProduct(id) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error("Nincs ilyen termék!");
        }
        return deletedProduct;
    }catch (err) {
        console.error(`HIBA a(z) ${id} azonosítójú termék törlése során!`, err);
        throw new Error("Nem sikerült törölni a terméket ID alapján!");
    }   
}

//Termék frissítése
export async function updateProduct(id, updatedData) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {new: true, runValidators: true});
        return updatedProduct;
    }catch (err) {
        console.error(`HIBA a(z) ${id} azonosítójú termék frissítése során!`, err);
        throw new Error("Nem sikerült frissíteni a terméket ID alapján!");
    }
}

//Termékek keresése név alapján
export async function searchProductsByName(searchTerm) {
    try {
        return await Product.find({
            name: { $regex: searchTerm, $options: 'i' }
            });
    }catch (err) {
        console.error(`HIBA a termékek keresése során a "${searchTerm}" kifejezésre!`, err);
        throw new Error("Nem sikerült keresni a termékeket név alapján!");
    }
}
