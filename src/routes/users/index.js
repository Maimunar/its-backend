import express from 'express'
import passport from 'passport'
import UserModel from '../../models/UserModel'


const router = express.Router();

function redirectIfLoggedIn(req, res, next) {
  if (req.user) return res.redirect('/users/account');
  return next();
}

module.exports = (params) => {
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/users/login',
    failureRedirect: '/',
  }));

  router.get('/login', redirectIfLoggedIn, (req, res) => res.send('/api', { error: req.query.error }));

  router.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/api');
  });

  router.get('/registration', redirectIfLoggedIn, (req, res) => res.send('/', { success: req.query.success }));

  router.post('/registration',
    async (req, res, next) => {
      try {
        const user = new UserModel({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          wishlist: {}
        });
        const savedUser = await user.save();
        if (savedUser) return res.redirect('/');
        return next(new Error('Failed to save user'));
      } catch (err) {
        return next(err);
      }
    });

  return router;
};
