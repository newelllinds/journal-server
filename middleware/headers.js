module.exports = function(req, res, next){ //allows us to export this module into another file, req = request from client, res = response

    res.header('access-control-allow-origin', '*'); //res.header called so server will response with what kind of headers are allowed in the request; 'access-control-allow-origin' header tells the server the specific origin locations that are allowed to communicate with the server. * means that everything is allowed--this setting is saying requests originating from any location are allowed to communicate with the database
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE'); //http methods that the server will allow being used
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //specific header types that the server will accept from the client

    next(); //next tells the middleware to continue its process, takes the request object and passes it on the endpoint on the server
};