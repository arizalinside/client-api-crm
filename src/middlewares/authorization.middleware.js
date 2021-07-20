const { verifyAccessJWT } = require('../helpers/jwt.helper')
const { getJWT } = require('../helpers/redis.helper')

const userAuthorization = async (req, res, next) => {
    const { authorization } = req.headers
    // console.log(authorization)

    //1. verify jwt is valid
    try {
        const decoded = await verifyAccessJWT(authorization)
        console.log(decoded)
        if (decoded.email) {
            const userId = await getJWT(authorization)
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            req.userId = userId
            return next()
        } 
        return res.status(403).json({
            message: 'Forbidden'
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    // if not decoded then will be error and get message forbidden

    //2. verify user is valid


    //2. check if jwt is exist in redis
    //3. extract user id
    //4. get user profile based on user id
}

module.exports = {
    userAuthorization
}