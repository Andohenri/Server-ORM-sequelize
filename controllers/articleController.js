const { Article, User, Comment } = require('../models')
const fs = require('fs')

exports.createArticle = async (req, res) => {
   const { title, description } = req.body
   if(!title) return res.status(409).json({ message: "Title required." })
   if(!description) return res.status(409).json({ message: "Description required." })
   try {
      const article = await Article.create({
         title, 
         description, 
         imageArticle: req.file 
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
            : "",
         UserId: req.user.id
      })
      return res.status(201).json(article)
   } catch (error) {
      return res.status(500).json({message: "Failed to create the article"})
   }
}
exports.updateArticle = async (req, res) => {
   const { id } = req.params
   const { title, description } = req.body
   try {
      const article = await Article.findByPk(id)
      if(req.file){
         const filename = article.imageArticle.split('/images/')[1]
         if(filename){
            fs.unlink(`uploads/${filename}`, (err) => {
                  if(err) throw err
            })
         }
      }
      const articleUpdated = await article.update({
         title, 
         description, 
         imageArticle: req.file 
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
            : article.imageArticle
      })
      return res.status(201).json(articleUpdated)
   } catch (error) {
      return res.status(500).json({message: error})
   }
}
exports.deleteArticle = async (req, res) => {
   const { id } = req.params
   try {
      const article = await Article.findByPk(id)
      if(!article) return res.status(404).json({ message: "Article not found" })
      await article.destroy()
      const filename = article.imageArticle
      if(filename){
         let fileName = filename.split('/images/')[1]
         fs.unlink(`uploads/${fileName}`, (err) => {
               if(err) throw err
         })
      }
      return res.status(200).json(article)
   } catch (error) {
      return res.status(500).json({ message: "Failed to delete article" })
   }
}
exports.getArticlebyId = async (req, res) => {
   try {
      const article = await Article.findByPk(req.params.id, {
         include: [
            {model: User, as: 'author', attributes: ['id', 'username', 'imageProfile']}
         ]
      })
      if(!article) return res.status(404).json({ message : "Article not found" })
      return res.status(200).json(article)
   } catch (error) {
      return res.status(500).json({message: "Internal server error"})
   }
}
exports.getArticles = async (req, res) => {
   try {
      const articles = await Article.findAll({
         include: [
            {model: User, as: 'author', attributes: ['id', 'username', 'imageProfile']},
            {model: Comment, as: 'comments', include: [{model: User, as: 'user', attributes: ['id', 'username', 'imageProfile']}]}
         ],
         order: [['createdAt', 'DESC']]
      })
      if(!articles) return res.status(404).json({ message : "No such articles" })
      return res.status(200).json(articles)
   } catch (error) {
      return res.status(500).json({message: error})
   }
}

//Current user
exports.getCurrentUserArticles = async (req, res) => {
   try {
      const articles = await Article.findAll({
         where: {UserId: req.user.id},
         include: [
            {model: User, as: 'author', attributes: ['id', 'username', 'imageProfile']},
            {model: Comment, as: 'comments', include: [{model: User, as: 'user'}]}
         ]
      })
      if(!articles) return res.status(404).json({ message : "No such articles" })
      return res.status(200).json(articles)
   } catch (error) {
      return res.status(500).json({message: error})
   }
}
exports.deleteCurrentUserArticle =  async (req, res) => {
   const { id } = req.params
   try {
      const article = await Article.findByPk(id)
      if(!article) return res.status(404).json({ message: "Article not found" })
      if(article.UserId !== req.user.id){
         return res.status(200).json({message: "Cannot delete this article"})
      }
      // await article.destroy()
      // const filename = article.imageArticle
      // if(filename){
      //    let fileName = filename.split('/images/')[1]
      //    fs.unlink(`uploads/${fileName}`, (err) => {
      //          if(err) throw err
      //    })
      // }
      // return res.status(200).json(article)
   } catch (error) {
      return res.status(500).json({ message: "Failed to delete article" })
   }
}
exports.updateCurrentUserArticle = async (req, res) => {
   const { id } = req.params
   const { title, description } = req.body
   try {
      const article = await Article.findByPk(id)
      if(article.UserId !== req.user.id){
         return res.status(404).json({ message: "Cannot update this article"})
      }
      if(req.file){
         const filename = article.imageArticle.split('/images/')[1]
         if(filename){
            fs.unlink(`uploads/${filename}`, (err) => {
                  if(err) throw err
            })
         }
      }
      const articleUpdated = await article.update({
         title, 
         description, 
         imageArticle: req.file 
            ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
            : article.imageArticle
      })
      return res.status(201).json(articleUpdated)
   } catch (error) {
      return res.status(500).json({message: error})
   }
}