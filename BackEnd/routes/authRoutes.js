const router = require('express').Router();
const authCOntroller = require('../controller/authController')
const authMiddleware = require('../middleware/authMiddleware')
const postController = require('../controller/postController')
const JwtMiddleware = require('../middleware/authenticateJWT')
const upload = require('../middleware/Multer')
const postMiddleware = require('../middleware/postMiddleware')
const adminController = require('../controller/adminController')

router.post('/signup' ,authMiddleware.validateSignup , authCOntroller.signup )
router.post('/verify',authMiddleware.optValidation ,authCOntroller.verify );
router.post('/login' , authMiddleware.loginValidation , authCOntroller.login);
router.post('/google-login', authCOntroller.googleLogin);

// sign up login routes
router.post('/createpost',JwtMiddleware.authenticateJWT,upload.single('file'), postMiddleware.postValidation,postController.createPost);
router.get('/getpost', postController.getAllPosts);
router.get('/getpostById',JwtMiddleware.authenticateJWT , postController.getPostsByParentId);

// delete route
router.delete('/deletePost/:id',JwtMiddleware.authenticateJWT , postController.deletePost);

// post routes (like-bnt edit-btn comment-btn delete-comment) 
router.post('/likeButton/:id' ,JwtMiddleware.authenticateJWT ,  postController.likeButton )
router.post('/commentButton/:id' ,JwtMiddleware.authenticateJWT ,  postController.commentButton )
router.post('/editComment/:postId/:editId' ,JwtMiddleware.authenticateJWT ,  postController.editComment )
router.post('/deleteComment/:postId/:commentId' ,JwtMiddleware.authenticateJWT ,  postController.deleteComment)

// admin Router
router.post('/adminSignup' ,authMiddleware.validateSignup , adminController.adminSignup)
router.post('/AdminVerify' ,authMiddleware.optValidation, adminController.AdminVerify)
router.post('/adminLogin' , authMiddleware.loginValidation , adminController.adminLogin)
router.get('/getAdminPost' , adminController.getAllPosts)
router.delete('/adminDeletePost/:id', JwtMiddleware.authenticateJWT , adminController.AdminDeletePost)
router.get('/viewAllUsers' , adminController.viewAllUsers)

// if routes not match
router.post('*' , (req,res) => res.send({Error : "Invalid Routes"}) )
router.get('*' , (req,res) => res.send({Error : "Invalid Routes"}) )

module.exports = router