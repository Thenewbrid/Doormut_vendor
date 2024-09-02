require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signInToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      image: user.image,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

const vendorSignInToken = (vendor) => {
  return jwt.sign(
    {
      _id: vendor._id,
      auth_id: vendor.auth_id,
      auth_password: vendor.auth_password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "2d" }
  );
};

const vendorToken = (staff, vendor) => {
  return jwt.sign(
    {
      _id: staff._id,
      store_id: vendor.store_id,
      name: staff.name,
      email: staff.email,
      password: staff.password,
      role: staff.role,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: "15m" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log('authorization',authorization)
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const admin = await Admin.findOne({ role: "Admin" });
  if (admin) {
    next();
  } else {
    res.status(401).send({
      message: "User is not Admin",
    });
  }
};

module.exports = {
  signInToken,
  vendorToken,
  vendorSignInToken,
  tokenForVerify,
  isAuth,
  isAdmin,
};
