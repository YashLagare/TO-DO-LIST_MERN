import jwt from 'jsonwebtoken';

export const generateToken= (userId, res)=>{

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })
    res.cookie('jwt', token, {
        httpOnly: true,// prevents attacks like cross-site scripting attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict', // prevents CSRF attacks and cross-site request forgery attacks
        secure: process.env.NODE_ENV !== 'development',
    });
    return token;
}