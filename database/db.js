import mongoose from "mongoose";
import { initaizeProduct } from "../models/Product.js";


export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Sikeres kapcsolódás az adatbázishoz!");

        await initaizeProduct();

        process.on("SIGINT", async () => {
            await mongoose.disconnect();
            console.log("Adatbázis kapcsolat lezárva!");
            process.exit(0);
        });

    }catch (err) {
        console.error("HIBA az adatbázis kapcsolódádánál!", err.message);
        process.exit(1);
    }
}
