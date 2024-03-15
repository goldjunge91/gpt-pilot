// const isAuthenticated = (req, res, next) => {
//   try {
//     if (req.session && req.session.userId) {
//       return next(); // User is authenticated, proceed to the next middleware/route handler
//     } else {
//       throw new Error('You are not authenticated');
//     }
//   } catch (error) {
//     console.error(error);
//     return next(new Error('You are not authenticated'));
//   }
// };

// module.exports = {
//   isAuthenticated
// };


const checkAuthenticated = (req, res, next) => {
  try {
    if (req.session) {
      console.log('req.session in AuthMiddleware:', req.session);
      return next(); // User is authenticated, proceed to the next middleware/route handler
    }

    else if (req.session.userId) {
      console.log('req.session.userId in AuthMiddleware:', req.session.userId);
      return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error hashing password in AuthMiddleware:', error);
    console.log('req', req.session, reg.session.userId,);
    next(error);
  }

};

module.exports = {
  checkAuthenticated
};