import UserRoute from './user.route.js';


const appRoutes = [{
    path: '/vi/user',
    route: UserRoute,
}, ];

export default (app) => {
    appRoutes.forEach((route) => {
        app.use(route.path, route.route);
    });
};