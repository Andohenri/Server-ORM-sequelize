const { addComment, deleteComment, updateComment } = require('../controllers/commentController')
const { authenticate } = require('../middlewares/auth')

const router = require('express').Router()

router.route('/:id')
   .delete(authenticate, deleteComment)
   .put(authenticate, updateComment)
router.route('/:articleId')
   .post(authenticate, addComment)

module.exports = router