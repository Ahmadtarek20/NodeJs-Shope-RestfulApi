const express = require('express');
const router = express.Router();
const cheakAuth = require('../middeleware/check-auth');
const multer = require('multer');
const ProductController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); //new error('masege)
    } else {
        cb(new Error('Only .jpeg or .png files are accepted'), false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', ProductController.product_get_all);

router.post('/', cheakAuth, upload.single('productImage'), ProductController.product_post_data);

router.get('/:productId', ProductController.product_get_one);

router.patch('/:productId', cheakAuth, ProductController.product_updat_data);
router.delete('/:productId', cheakAuth, ProductController.product_deleted);

module.exports = router;