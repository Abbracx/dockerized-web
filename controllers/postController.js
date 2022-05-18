const Post = require("../models/postModel");

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
        return res.status(200).json({
            status: "success",
            results: posts.length,
            data: {
                posts,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'server fail',
        })
    }
}

exports.getOnePost = async(req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: {
          post,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "server fail",
      });
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body)
        return res.status(200).json({
            status: "Successful",
            data:  {
                post,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Server fail'
        })
    }
}

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "server fail",
    });
  }
};


exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "server fail",
    });
  }
};