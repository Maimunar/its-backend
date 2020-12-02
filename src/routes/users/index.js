import express from 'express'
import passport from 'passport'
import UserModel from '../../models/UserModel'
import userController from '../../controllers/UserController'
import { loggedIn, adminOnly } from '../auth.middleware'

const router = express.Router();

module.exports = (params) => {

  router.post('/register', userController.register)

  router.post('/login', userController.login);

  router.get('/authuseronly', loggedIn, userController.authuseronly);

  router.get('/adminonly', loggedIn, adminOnly, userController.adminonly);

  return router;
}




// module.exports = (params) => {
//   router.post('/login',
//     passport.authenticate('local',
//       {
//         successRedirect: '/',
//         failureRedirect: '/login?error=true'
//       }))


//   router.get('/logout', (req, res) => {
//     req.logout();
//     return res.redirect('/api');
//   });

//   router.get('/registration', redirectIfLoggedIn, (req, res) => res.send('/', { success: req.query.success }));

//   router.post('/registration',
//     async (req, res, next) => {
//       try {
//         const user = new UserModel({
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           wishlist: {}
//         });
//         const savedUser = await user.save();
//         if (savedUser) return res.redirect('/');
//         return next(new Error('Failed to save user'));
//       } catch (err) {
//         return next(err);
//       }
//     });

//   return router;
// };
