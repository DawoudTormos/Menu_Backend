// routes/owner.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');


router.use(authMiddleware.protect);

router.get('/getRestuarantData', ()=>{});
router.get('/getItemsData', ()=>{});
router.get('/getPic', ()=>{});

module.exports = router;