const mongoose = require('mongoose');
const Post = require('../model/createPost');
const User = require('../model/authModel');
const imageData = require('../model/uploadImage');
const { use } = require('../routes/authRoutes');

// Create Post
const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const path = req.file.filename;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        user.postCount += 1;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.save()
        const image = new imageData({ path })
        await image.save()
        const newPost = new Post({ parentId: userId, title, description, imageId: image._id});
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });
        if (!posts) {
            return res.status(404).json({ message: 'No post found' })
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// get post by parent id
const getPostsByParentId = async (req, res) => {
    try {
        // const { parentId } = req.params;
        const userID = req.user;
        // console.log(userID)
        const posts = await Post.find({ parentId: userID.userId }).populate('parentId').populate('imageId');
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found for this parent ID' });
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;
        const user = await User.findById(userId);
        user.postCount -= 1;
        const post = await Post.find({ postId });
        if (!post) {
            return res.status(404).json({ message: 'No post found' })
        }
        await user.save()
        await Post.deleteOne({ postId });
        res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// like button
const likeButton = async (req, res) => {
    try {
        const { id } = req.params, userID = req.user.userId , post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'No post found' })
        const isLike = post.likes.findIndex(ele => ele.user.toString() === userID.toString());
        if (isLike !== -1) {
            await Post.updateOne({ _id: id }, { $pull: { likes: { user: userID } } });
            const data = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });
            res.status(200).json({ message: 'Post unliked successfully', data })
        }
        else {
            await post.likes.push({ user: userID});
            await post.save();
            const data = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });
            res.status(200).json({ message: 'Post liked successfully', data })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// comment button
const commentButton = async (req, res) => {
    try {        
        const { id } = req.params, userID = req.user.userId, { comment } = req.body, post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'No post found' });
        post.comments.push({ user: userID, comment });
        await post.save();
        const data = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });
        res.status(200).json({ message: 'Comment added successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//  edit comment 
const editComment = async (req, res) => {
    try {
        const { postId, editId } = req.params , post = await Post.findOne({ _id: postId });
        if (!post) return res.status(404).json({ message: 'No post found' });
        post.comments = post.comments.map((ele) => {
            if (ele._id == editId) {
                ele.comment = req.body.comment
                return ele
            }
            return ele
        })
        await post.save();
        const data = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });;
        res.status(200).json({ message: 'Comment edited successfully', data });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// delete comment
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params
        const post = await Post.findOne({ _id: postId });
        if (!post) return res.status(404).json({ message: 'No post found' });
        const commentFind = post.comments.filter(ele => !ele._id.equals(commentId))
        if (!commentFind) return res.status(404).json({ message: 'No comment found' });
        post.comments = commentFind;
        await post.save();
        const data = await Post.find().populate('parentId').populate('imageId').populate({ path: 'comments.user', select: 'name' });;
        res.status(200).json({ message: 'comment delete', data })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}


module.exports = { createPost, getAllPosts, getPostsByParentId, deletePost, likeButton, commentButton, editComment, deleteComment };