// pages/api/validate-jwt.js

import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
 const token = req.headers['authorization'];

 try {
   jwt.verify(token, process.env.JWT_SECRET);
   res.status(200).json({ valid: true });
 } catch (err) {
   // Token is niet geldig
   res.status(401).json({ valid: false });
 }
}
