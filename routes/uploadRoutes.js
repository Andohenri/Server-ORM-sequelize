const router = require('express').Router()
const multer = require('../middlewares/multer')
const uploadImages = multer.fields([{name: 'imageProfile' , maxCount: 1}, {name: 'imageArticle' , maxCount: 1}])

router.route('/').post((req, res) => {
   uploadImages(req, res, (err) => {
      console.log(req.files)
      if(err){
         res.status(400).json({ message: err.message })
      }else if(req.files['imageProfile'] || req.files['imageArticle']){
         const imageProfile = req.files['imageProfile'] ? req.files['imageProfile'][0].filename : null
         const imageArticle = req.files['imageArticle'] ? req.files['imageArticle'][0].filename : null

         res.status(200).json({
            message: "Images uploaded succesfully",
            imageProfile,
            imageArticle
         })
      }else{
         res.status(400).json({ message: "No files provided" })
      }
   })
})
module.exports = router