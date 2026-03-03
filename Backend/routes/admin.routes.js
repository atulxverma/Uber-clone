const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/dashboard', 
    authMiddleware.authAdmin, 
    adminController.getDashboardStats
);

module.exports = router;