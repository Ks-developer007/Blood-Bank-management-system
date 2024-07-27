const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (existingUser) {
      res.status(200).send({ message: "User already exists", success: false });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    //checking existing user or not
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invaild User",
      });
    }
    if (user.role !== req.body.role) {
      res.status(503).send({
        success: false,
        message: "role is not matched",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(404).send({
        success: false,
        message: "Invaild Password",
      });
    }
    //user token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "2d",
    });
    return res.status(200).send({
      success: true,
      message: "login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

//current user
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };
