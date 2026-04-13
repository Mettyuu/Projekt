import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
import productRoutes from './routes/Routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Session beállítása
app.use(session({
    secret: 'nagyon_titkos_kulcs',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } //1 óra
}));

app.use((req, res, next) => {
    res.locals.cart = req.session.cart || [];
    res.locals.currentPath = req.path;
    next();
});

app.use('/', productRoutes);

app.get('/', (req, res) => {
    res.send('A szerver fut!');
});

app.listen(PORT, () => {
    console.log(`A szerver ezen a porton fut: http://localhost:${PORT}`);
});
