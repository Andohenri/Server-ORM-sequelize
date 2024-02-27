const { createArticle, updateArticle, getArticlebyId, getArticles, getMyArticles } = require('../controllers/articleController')
const { authenticate } = require('../middlewares/auth')
const multer = require('../middlewares/multer')

const router = require('express').Router()

router.route('/')
   .post(authenticate, multer.single('imageArticle'), createArticle)
   .get(authenticate, getArticles)
router.route('/my_articles')
   .get(authenticate, getMyArticles)
router.route('/:id')
   .put(authenticate, multer.single('imageArticle'), updateArticle)
   .get(authenticate, getArticlebyId)
   

module.exports = router