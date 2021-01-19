const jwt = require('jsonwebtoken'); //importing the JWT package in order to interact with the token assigned to each session
const User = require('../db').import('../models/user'); //communicating with the user model to find out more info about a specific user

const validateSession = (req, res, next) => {
    const token = req.headers.authorization; //holds the token which is pulled from the authorization header of the incoming request
    console.log('token --> ', token);

    if (!token) { //if no token is present the 403 forbidden error is returned as the response
        return res.status(403).send({ auth: false, message: "No token provided"})
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => { //calls upon the JWT package and invokes the verify method which decodes the token. if successful, decodeToken will contain the decoded payload (data stored in our token). If not, decodeToken reamins undefined. err is null by default.
            console.log('decodeToken --> ', decodeToken);
            if (!err && decodeToken) { //if statement checks if there is no error AND if decided has a value
                User.findOne({ //Sequelize findOne method looks for an id in the users table that matches the decodeToken.id property
                    where: {
                        id: decodeToken.id
                    }
                })
                .then(user => { // The sequelize findOne method returns a promise that we can resolve using a .then()
                    console.log('user --> ', user);
                    if (!user) throw err; //if no user is found, an error message is thrown
                    console.log('req --> ', req);
                    req.user = user; //
                    return next(); //Exits us out of this function
                })
                .catch(err => next(err)); //if our promise is rejected, we can capture that response in a .catch() and pass an error into the next() function
            } else {
                req.errors = err; //If there is no value for the decodeToken, take the err parameter from line 10 and append it to the req object as a new key-value pair. We will also return an error with a message that tells us the user is not authorized.
                return res.status(500).send('Not Authorized');
            }
        });
    }
};

module.exports = validateSession;