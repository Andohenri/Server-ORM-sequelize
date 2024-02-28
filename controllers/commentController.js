const { Comment } = require('../models')
exports.addComment = async (req, res) => {
   const { id: userId } = req.user
   const { articleId } = req.params
   const { content } = req.body

   if(!content) return res.status(409).json({ message: "Content is required" })
   try {
      const comment = await Comment.create({
         content,
         userId,
         articleId })
      return res.status(201).json(comment)
   } catch (error) {
      return res.status(500).json(error)
   }
}
exports.deleteComment = async (req, res) => {
   const id = req.params.id
   try {
      const comment = await Comment.findByPk(id)
      if(!comment) return res.status(404).json({ message: "Comment not found"})
      if(req.user.id !== comment.userId) return res.status(401).json({ message: "Cannot delete this comment"})
      await comment.destroy()
      return res.status(200).json(comment)
   } catch (error) {
      return res.status(500).json({ message: "Failed to delete this comment"})
   }
}
exports.updateComment = async (req, res) => {
   const id = req.params.id
   const { content } = req.body
   try {
      const comment = await Comment.findByPk(id)
      if(!comment) return res.status(404).json({ message: "Comment not found"})
      if(req.user.id !== comment.userId) return res.status(401).json({ message: "Cannot update this comment"})
      await comment.update({content})
      return res.status(200).json(comment)
   } catch (error) {
      return res.status(500).json({ message: "Failed to delete this comment"})
   }
}