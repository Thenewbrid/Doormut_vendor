const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  signInToken,
  tokenForVerify,
  vendorToken,
  vendorSignInToken,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const Vendor = require("../models/Vendor");
const Orders = require("../models/Order");
const Product = require("../models/Products");

const getAllVendors = async (req, res) => {
  // console.log('allamdin')
  try {
    const vendor = await Vendor.find({}).sort({ _id: -1 });
    res.send(vendor);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getVendorsById = async (req, res) => {
  // console.log('allamdin')
  try {
    const vendor = await Vendor.findById({ _id: req.params.id });
    res.send(vendor);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getVendorsByStoreId = async (req, res) => {
  // console.log('allamdin')
  try {
    const vendor = await Vendor.findOne({ store_id: req.params.id });
    res.send(vendor);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const registerVendor = async (req, res) => {
  try {
    const isAdded = await Vendor.findOne({ store_id: req.body.store_id });
    if (isAdded) {
      return res.status(500).send({
        message: "Duplicate store ID. This Store is already exists!",
      });
    } else {
      const newVendor = new Vendor({
        store_name: req.body.store_name,
        store_id: req.body.store_id,
        store_type: req.body.store_type,
        store_address: req.body.store_address,
        store_coverImg: req.body.store_coverImg,
        store_profileImg: req.body.store_profileImg,
        staffs: [req.body].map((staff) => ({
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          password: bcrypt.hashSync(staff.password),
          profileImg: staff.profileImg,
          role: "Super Admin",
        })),
      });
      await newVendor.save();
      res.status(200).send({
        message: "Vendor Added Successfully!",
      });
      const body = {
        // the reset password url is meant to be the link to the resetPassword page on the front-end
        //this link won't work now as the page has not been created
        from: process.env.EMAIL_USER,
        to: `${req.body.email}`,
        subject: "Doormut Vendor Login Credentials",
        html: `<h2>Hello ${req.body.name}</h2>
        <p>We have successfuly added you to our vendor system. Use the following credentials to login to your <strong>Doormut vendor</strong> account </p>

        <p>Don't share this with anyone.</p>

        <p style="margin-bottom:5px;"><strong>Your Vendor/Store Id: </strong>${req.body.store_id}</p>
        <p style="margin-bottom:5px;"><strong>Your Login Id: </strong>${req.body.email}</p>
        <p style="margin-bottom:5px;"><strong>Your Password: </strong>${req.body.password}</p>      
        <p style="margin-top: 25px;">We look foward to working with you</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong style="color:#22c55e">Doormut Team</strong>
             `,
      };
      const message =
        "Login credentials has been succesfully sent to the vendor";
      sendEmail(body, res, message);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};
const loginVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      store_id: req.body.store_id,
    });
    if (vendor) {
      const staff = vendor.staffs.find(
        (staff) => staff.email === req.body.email
      );
      if (staff && bcrypt.compareSync(req.body.password, staff.password)) {
        const token = vendorSignInToken(vendor);
        res.send({
          token,
          _id: vendor._id,
          store_id: vendor.store_id,
          store_name: vendor.store_name,
          name: staff.name,
          phone: staff.phone,
          email: staff.email,
          profileImg: staff.profileImg,
          role: staff.role,
          message: "Login successful",
        });
      } else {
        res.status(401).send({
          message: "Invalid Email or password!",
        });
      }
    } else {
      res.status(401).send({
        message: "Invalid Store Id",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//fix
const forgetPassword = async (req, res) => {
  const vendor = await Vendor.findOne({
    store_id: req.body.store_id,
  });
  const verifyEmail = req.body.verifyEmail;
  if (vendor) {
    const staff = vendor.staffs.find((staff) => staff.email === verifyEmail);
    if (!staff) {
      return res.status(404).send({
        message: "Vendor not found with this email!",
      });
    } else {
      const token = vendorToken(staff, vendor);
      const body = {
        // the reset password url is meant to be the link to the resetPassword page on the front-end
        //this link won't work now as the page has not been created
        from: process.env.EMAIL_USER,
        to: `${verifyEmail}`,
        subject: "Password Reset",
        html: `<h2>Hello ${staff.name}</h2>
      <p>A request has been received to change the password for your <strong>Kachabazar</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>
        <a href=${process.env.ADMIN_URL}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>
      
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@kachabazar.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Kachabazar Team</strong>
             `,
      };
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
      res.status(200).send({
        token,
      });
    }
  } else {
    res.status(401).send({
      message: "Invalid Store Id",
    });
  }
};
const resetPassword = async (req, res) => {
  // const token = req.params.token;
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const { store_id } = jwt.decode(token);
  const vendor = await Vendor.findOne({
    store_id: store_id,
  });

  try {
    if (token) {
      const staff = vendor.staffs.find((staff) => staff.email === email);
      jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
        if (err) {
          return res.status(500).send({
            message: "Token expired, please try again!",
          });
        } else {
          staff.password = bcrypt.hashSync(req.body.newPassword);
          vendor.save();
          res.send({
            message: "Your password has been reset. You can login now!",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (vendor) {
      vendor.store_name = req.body.store_name;
      vendor.store_id = req.body.store_id;
      vendor.store_type = req.body.store_type;
      vendor.store_address = req.body.store_address;
      vendor.store_coverImg = req.body.store_coverImg;
      vendor.store_profileImg = req.body.store_profileImg;
      await vendor.save();
      res.send({ message: "Vendor Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const categorySystem = async (req, res) => {
  const id = req.params.id;
  const category = req.body.category;

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    const existingCategory = vendor.categories.find(
      (rating) => rating.category === category
    );
    if (existingCategory) {
      res.send({ message: "This category already exists" });
    } else {
      vendor.categories.push({ category });
    }
    await vendor.save();
    res.json({ message: "Category added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addStaff = async (req, res) => {
  const vendorId = req.params.id;
  const name = req.body.name;
  const password = bcrypt.hashSync(req.body.password);
  const phone = req.body.phone;
  const email = req.body.email;
  const role = req.body.role;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    const existingStaff = vendor.staffs.find((staff) => staff.email === email);
    if (existingStaff) {
      res.json({ message: "This staff already exists" });
    } else {
      vendor.staffs.push({ name, password, phone, email, role });
      res.json({ message: "Staff added succesfully" });
      await vendor.save();
      const body = {
        // the reset password url is meant to be the link to the resetPassword page on the front-end
        //this link won't work now as the page has not been created
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: "Doormut Vendor Login Credentials",
        html: `<h2>Hello ${name}</h2>
        <p>You have been added to <strong>${vendor.store_name}</strong> dashboard as a/an ${role}. </p>

        <p>Don't share this with anyone.</p>

        <p style="margin-bottom:5px;"><strong>Your Login Email: </strong>${email}</p>
        <p style="margin-bottom:5px;"><strong>Your Password: </strong>${password}</p>      
        <p style="margin-top: 25px;">We look foward to working with you</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong style="color:#22c55e">Doormut Team</strong>
             `,
      };
      const message =
        "Login credentials has been succesfully sent to the staff";
      sendEmail(body, res, message);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const ratingSystem = async (req, res) => {
  const vendorId = req.params.vendorId;
  const userId = req.body.userId;
  const rating = req.body.rating;
  const comment = req.body.comment;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    const existingRating = vendor.scoring.find(
      (rating) => rating.userId === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      vendor.scoring.push({ userId, rating, comment });
    }
    await vendor.save();
    res.json({ message: "Rating and comment updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVendorRating = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
    }

    const ratings = vendor.scoring;
    res.json({ ratings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//freeze/activate  :wizicodes
const freeze = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.freeze();
    res.send({ message: "Vendor frozen successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error freezing vendor" });
  }
};
const unFreeze = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.unfreeze();
    res.send({ message: "Vendor is successfully unfrozen" });
  } catch (error) {
    res.status(500).send({ message: "Error unfreezing vendor" });
  }
};

const activate = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.activate();
    res.send({ message: "Vendor activated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error activating vendor" });
  }
};

const deActivate = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.deactivate();
    res.send({ message: "Vendor deactivated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deactivating vendor" });
  }
};

const vendorOrders = async (req, res) => {
  try {
    const vendorId = req.params.store_id;
    const id = req.params.id;
    if (!id && vendorId) {
    }
    const order = await Orders.find({});
    const product = await Product.find({});
    const vendorProduct = product.filter((item) => {
      return item.store_id === vendorId;
    });
    const orderId = vendorProduct.map((item) => item.productId);

    const vendorOrders = order
      .filter((order) => {
        const cartItems = order.cart.filter((item) =>
          orderId.includes(item.productId)
        );
        return cartItems.length > 0;
      })
      .map((order) => {
        const cartItems = order.cart.filter((item) =>
          orderId.includes(item.productId)
        );
        const totalAmount = cartItems.reduce(
          (acc, item) => acc + item.itemTotal,
          0
        );
        return {
          status: order.status,
          paymentmethod: order.paymentMethod,
          orderTime: order.createdAt,
          customerName: order.user_info.name,
          invoiceNo: order.invoice,
          totalAmount: totalAmount,
          id: order.id,
          userId: order.user_info,
          cartItems: cartItems.filter((item) => item.itemTotal > 0), // filter out empty cartItems
        };
      })
      .filter((order) => order.cartItems.length > 0); // filter out orders with empty cartItems
    if (id) {
      const orderData = vendorOrders.filter((item) => {
       return item.id === id;
      });
      res.send(orderData);
    } else {
      res.send(vendorOrders);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  resetPassword,
  forgetPassword,
  loginVendor,
  getAllVendors,
  getVendorsById,
  registerVendor,
  ratingSystem,
  updateVendor,
  categorySystem,
  freeze,
  unFreeze,
  activate,
  deActivate,
  addStaff,
  vendorOrders,
};
