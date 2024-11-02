const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({error: 'Token not found'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded
        next()
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: 'Invalid token'})
    }
}

module.exports = auth