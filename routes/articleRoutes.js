const { createArticle, updateArticle, getArticlebyId, getArticles, deleteArticle, deleteCurrentUserArticle, updateCurrentUserArticle, getCurrentUserArticles } = require('../controllers/articleController')
const { authenticate, authorizedAsAdmin } = require('../middlewares/auth')
const multer = require('../middlewares/multer')

const router = require('express').Router()

router.route('/')
   .post(authenticate, multer.single('imageArticle'), createArticle)
   .get(authenticate, getArticles)

router.route('/my_articles')
   .get(authenticate, getCurrentUserArticles)
router.route('/my_articles/:id')
   .delete(authenticate, deleteCurrentUserArticle)
   .put(authenticate, multer.single('imageArticle'), updateCurrentUserArticle)

router.route('/:id')
   .get(authenticate, getArticlebyId)
   .put(authenticate, authorizedAsAdmin, multer.single('imageArticle'), updateArticle)
   .delete(authenticate, authorizedAsAdmin, deleteArticle)
   

module.exports = router