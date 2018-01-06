import post from './post';
import account from './account';

export const accountRoute = {
    baseRoute: '/api/v1/account',
    signin: '/signin',
    signup: '/signup',
    exist: '/exist', // check if userName or email is already taken
    deleteUser: '/delete/:userId',
    updateUser: '/update/user/:userId',
}

export const authenticationMiddleware = (req, res, next) => {
}

const Routes = {
    Post: post,
    Account: account
};
export default Routes;