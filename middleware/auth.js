import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_par_defaut');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token invalide" });
    }
};

export default auth;