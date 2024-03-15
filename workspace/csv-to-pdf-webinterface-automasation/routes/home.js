const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middleware/authMiddleware');

router.get('/', checkAuthenticated, (req, res) => {
    res.render('home', {
        user: req.user,
    });
});

module.exports = router;