const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postController');

router.get('/', ctrl.listPosts);
router.get('/post/:slug', ctrl.getPost);

router.get('/create', ctrl.createForm);
router.post('/create', ctrl.createPost);

router.get('/edit/:slug', ctrl.editForm);
router.put('/edit/:slug', ctrl.updatePost);

router.delete('/delete/:slug', ctrl.deletePost);

module.exports = router;