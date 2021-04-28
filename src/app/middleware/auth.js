const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({message: 'Token not provided'})
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await jwt.verify(token, process.env.APP_SECRET)

    req.userId = decoded.id

    return next();
  } catch (error) {
    return res.status(401).json({message: 'Token invalid'})
  }
}