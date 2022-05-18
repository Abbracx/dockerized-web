const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { response } = require("express");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashpassword = await bcrypt.hash(password, 12);

  try {
    const newUser = await User.create({
      username,
      password: hashpassword,
    });
    const { password, ...user } = newUser.toJSON();
    return res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Server Failed",
    });
  }
};


exports.login = async(req, res, next) => {
    const { username, password } = req.body

    try {
        const hashPassword = await bcrypt.hash(password, 12)
        const user = await User.findOne({username})
         
        if(!user) {
            res.status(404).json({
            status: 'Not Found',
            message: 'User not found with credentials'
            })
        } 
        const isCorrect = await bcrypt.compare(password, user.password)
        if(isCorrect){
            res.status(200).json({
                status: "Success"
            })
        }else{
            res.status(400).json({
              status: "Failed",
              message: "Incorrect Username/Password"
            });
        }
    } catch (error) {
        
    }
}

