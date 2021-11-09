

module.exports = (req, res, next) => {
    try {
        
        if(!req.userData.isAdmin) {
            
            throw "Not Admin"
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid Request'
        });
    }
};