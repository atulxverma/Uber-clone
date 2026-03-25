const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const validationResult = require("express-validator").validationResult;
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);

  const { fullname, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(201).json({ user, token });
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });

    } catch (err) {
        console.error("❌ Login Controller Error:", err); // Ye error Render Logs me dikhega
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        const { fullname } = req.body;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { "fullname.firstname": fullname.firstname, "fullname.lastname": fullname.lastname },
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
