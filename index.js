const express = require('express');
const app = express();
const config = require('./shared/config');
const port = config.port;
const bodyParser = require('body-parser');
const AuthRouter = require('./routes/auth/routes.config');
const UserRouter = require('./routes/users/routes.config');
const ProductsRouter = require('./routes/products/routes.config');
const CartRouter = require('./routes/cart/routes.config');
const OrderRouter = require('./routes/order/routes.config');

app.use(function (request, response, next) {
    request.header('Access-Control-Allow-Origin', '*');
    request.header('Access-Control-Allow-Credentials', 'true');
    request.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    request.header('Access-Control-Expose-Headers', 'Content-Length');
    request.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (request.method === 'OPTIONS') {
        return response.sendStatus(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

AuthRouter.routes(app);
UserRouter.routes(app);
ProductsRouter.routes(app);
CartRouter.routes(app);
OrderRouter.routes(app);

app.listen(port, function () {
    console.log('app listening at port %s', port);
});
