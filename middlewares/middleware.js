const jwt = require('jsonwebtoken')
const jwtSecret = process.env.jwt_secret || process.env.JWT_SECRET


class middleware{
    auth = async(req,res,next)=>{
        const {authorization} = req.headers
        if(authorization){
            const token = authorization.split("Bearer ")[1]
            
            if (token) {
                try {
                    const userinfo = await jwt.verify(token, jwtSecret)
                    req.userinfo = userinfo
                    next()
                
                } catch (error) {
                    return res.status(401).json({message : "Unauthorized"})
                }
            } else {
                return res.status(401).json({message : "Unauthorized"})
            }
        }else{
            return res.status(401).json({message : "Unauthorized"})
        }   
    }

    role = async(req,res,next)=>{
        const {userinfo} = req
        if(userinfo.role === "admin"){
            next()
        }else{
            return res.status(403).json({message : "access denied"})
        }
    }
}

module.exports = new middleware()