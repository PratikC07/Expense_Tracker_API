import jwt from "jsonwebtoken";

const verifyToken = async(req, res, next)=>{
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            })
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = data.userId;
        console.log("User is verified using token");
        
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify token",
            error: error.message,
        })
    }
}

const authMiddleware = {
    verifyToken,
}

export default authMiddleware;