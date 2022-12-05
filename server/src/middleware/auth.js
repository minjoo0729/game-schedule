const AccountModel = require('../models/account');

const authMiddleware = async (req, res, next) => {
    const { username, password } = req.body.credential;
    const UsernameFilter = { username: username };
    
    try {
        const account = await AccountModel.findOne(UsernameFilter);

        if ( account ) {
            if ( password === account.password ) {
                console.log("[AUTH-MIDDLEWARE] Authorized User");
                next();
            } else {
                console.log("[AUTH-MIDDLEWARE] Not Authorized User");
                res.status(401).json({ error: "Wrong Password" });
            }
        } else {
            if(username) {
                const account = new AccountModel({ username, password });
                const res = await account.save();
    
                console.log("[AUTH-MIDDLEWARE] New Authorized User");
                next();
            } else {
                console.log("[AUTH-MIDDLEWARE] Empty Username");
                res.status(401).json({ error: "Empty Username" });
            }
        }
    } catch (e) {
        console.log(`[AUTH-MIDDLEWARE] An Error Occurred: ${ e }`);
        res.status(500).json({ error: `${ e }` });
    }
}

module.exports = authMiddleware;