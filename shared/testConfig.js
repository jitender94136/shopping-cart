module.exports = {
    "port": 3000,
    "role": {
        "CUSTOMER" : 1,
        "SELLER" : 5 ,
        "ADMIN" : 100
    },
    "dbURI" : "mongodb://localhost:27017/shopping-cart-test",
    "jwt_secret": "mytestsecret",
    "jwt_expiration_in_seconds": 3600
};
