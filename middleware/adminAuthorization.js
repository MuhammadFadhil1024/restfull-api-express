class adminAuthorization {
    static async isAdmin(req, res, next) {
        const userData = req.userData
        // console.log(userData)
        return userData.role == 'admin'
            ? next()
            : res.status(403).json({
                  code: 403,
                  status: 'FROBIDDEN',
                  error: 'You dont have acces fpr this resource!',
              })
    }
}

module.exports = adminAuthorization
