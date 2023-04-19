const router = require("express").Router();
const {viewPosts, createPosts,addComment} = require("../controllers/posts");
const {signup_post,login_post,update_password} = require('../controllers/user');

// posts routes
router.post('/posts/create', createPosts);
router.get('/posts/get',viewPosts);

router.put('/posts/addComment',addComment);

router.post('/auth/signup', signup_post);

router.post('/auth/login', login_post);

router.post('/auth/changePassword',update_password);

module.exports = router;