import UserRoute from './user.route.js';
import ProductRoute from './product.route.js';


const appRoutes = [{
        path: '/v2/user',
        route: UserRoute,
    },
    {
        path: '/v2/product',
        route: ProductRoute,
    },
];

export default (app) => {
    appRoutes.forEach((route) => {
        app.use(route.path, route.route);
    });
};
