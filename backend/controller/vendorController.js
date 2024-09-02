// wizicodes
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
const mongoose = require("mongoose");

const getAllVendors = async (req, res) => {
  // console.log('allamdin')
  // const vendorId = req.params.id;
  const searchQuery = req.query.search;
  const storeType = req.query.type;

  try {
    const vendor = await Vendor.find({}).sort({ _id: -1 });

    let filteredVendors = vendor;
    if (searchQuery) {
      filteredVendors = filteredVendors.filter((user) => {
        return user.store_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }
    if (storeType) {
      filteredVendors = filteredVendors.filter((user) => {
        return user.store_type.toLowerCase() === storeType.toLowerCase();
      });
    }
    res.send(filteredVendors);
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
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
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
        store_email: req.body.store_email,
        store_phone: req.body.store_phone,
        store_id: req.body.store_id,
        store_type: req.body.store_type,
        store_address: req.body.store_address,
        map_coordinates: req.body.map_coordinates,
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
        const token = vendorSignInToken(staff, vendor);
        res.send({
          token,
          _id: vendor._id,
          store_id: vendor.store_id,
          store_name: vendor.store_name,
          staffId: staff._id,
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

//will be visited later
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (vendor) {
      vendor.store_name = req.body.store_name;
      vendor.store_id = req.body.store_id;
      vendor.store_type = req.body.store_type;
      vendor.store_address = req.body.store_address;
      vendor.map_coordinates = req.body.map_coordinates;
      vendor.store_coverImg = req.body.store_coverImg;
      vendor.store_profileImg = req.body.store_profileImg;
      vendor.store_email = req.body.store_email;
      vendor.store_phone = req.body.store_phone;

      await vendor.save();
      res.send({ message: "Vendor Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

// uncertain
const updateVendorlogin = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }

    const superAdmin = vendor.staffs.find(
      (staff) => staff.role === "Super Admin"
    );
    if (!superAdmin) {
      return res.status(404).send({ message: "No Super Admin found" });
    }

    superAdmin.email = req.body.email;
    superAdmin.password = bcrypt.hashSync(req.body.password);

    await vendor.save();
    res.send({ message: "Vendor login credentials updated!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating vendor" });
  }
};

const updateVendorAddress = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    } else {
      vendor.store_address = req.body.store_address;
      vendor.map_coordinates = req.body.map_coordinates;
      await vendor.save();
      res.status(200).send({ message: "Vendor address updated!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error updating address", err });
    console.log(err);
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
    } else if (
      role === "Super Admin" &&
      vendor.staffs.some((staff) => staff.role === "Super Admin")
    ) {
      res.status(500).json({ message: "You can only have one Super Admin" });
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

const updateStaff = async (req, res) => {
  try {
    const update = {
      $set: {
        "staffs.$.name": req.body.name,
        "staffs.$.email": req.body.email,
        "staffs.$.phone": req.body.phone,
        "staffs.$.role": req.body.role,
        "staffs.$.profileImg": req.body.profileImg,
      },
    };
    const filter = { _id: req.params.id, "staffs._id": req.params.staffId };
    await Vendor.updateOne(filter, update);
    res.status(200).send({ message: "Staff information updated!" });
  } catch (err) {
    res.status(500).send({ message: "Error updating staff information" });
    console.log(err);
  }
};

const deleteStaff = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const staffId = req.params.staffId;

    const query = { _id: vendorId };
    const update = { $pull: { staffs: { _id: staffId } } };

    const vendor = await Vendor.findOneAndUpdate(query, update, { new: true });

    if (!vendor) {
      res.status(404).send({ message: "Vendor not found" });
    } else {
      res.status(200).send({ message: "Staff deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllStaffs = async (req, res) => {
  console.log(req.user?.role);

  try {
    const vendorId = req.params.id;
    const searchQuery = req.query.search;
    const staffRole = req.query.staffRole;
    const authenticatedUserRole = req.user.role;

    const rolesHierarchy = {
      "Super Admin": [
        "Admin",
        "Manager",
        "CEO",
        "Accountant",
        "Cashier",
        "Driver",
        "Security Guard",
      ],
      Admin: [
        "Manager",
        "CEO",
        "Accountant",
        "Cashier",
        "Driver",
        "Security Guard",
      ],
      CEO: ["Manager", "Accountant", "Cashier", "Driver", "Security Guard"],
      Manager: ["Accountant", "Cashier", "Driver", "Security Guard"],
      Accountant: ["Cashier", "Driver", "Security Guard"],
      Cashier: ["Driver", "Security Guard"],
      Driver: ["Security Guard"],
      "Security Guard": [],
    };

    let query = { _id: vendorId };
    let projection = {
      staffs: {
        $filter: {
          input: "$staffs",
          as: "staff",
          cond: {
            $in: ["$$staff.role", rolesHierarchy[authenticatedUserRole]],
          },
        },
      },
    };

    const vendor = await Vendor.findOne(query, projection);

    if (!vendor) {
      res.status(404).send({ message: "Vendor not found" });
    } else {
      let filteredStaffs = vendor.staffs;

      if (searchQuery && staffRole) {
        filteredStaffs = filteredStaffs.filter((staff) => {
          return (
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            staff.role === staffRole
          );
        });
      } else if (searchQuery) {
        filteredStaffs = filteredStaffs.filter((staff) => {
          return staff.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
      } else if (staffRole) {
        filteredStaffs = filteredStaffs.filter((staff) => {
          return staff.role === staffRole;
        });
      }

      res.status(200).send(filteredStaffs);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal server error" });
  }
};

const findStaffById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      staffs: { $elemMatch: { _id: req.params.staffId } },
    });
    if (!vendor) {
      return res.status(404).send({ message: "Vendor or staff not found" });
    }
    const staff = vendor.staffs.find(
      (staff) => staff._id.toString() === req.params.staffId
    );
    res.status(200).send(staff);
  } catch (err) {
    res.status(500).send({ message: "internal Server Error" });
    console.log(err);
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

const verify = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.verify();
    res.send({ message: "Vendor is successfully verified!!" });
  } catch (error) {
    res.status(500).send({ message: "Error verifying vendor" });
  }
};

const unverify = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.unverify();
    res.send({ message: "Vendor is successfully unverified!!" });
  } catch (error) {
    res.status(500).send({ message: "Error verifying vendor" });
  }
};

//freeze/activate  :wizicodes
const freeze = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
    if (!vendor) {
      return res.status(404).send({ message: "Vendor not found" });
    }
    await vendor.freeze();
    res.send({ message: "Vendor frozen successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error freezing vendor" });
  }
};
const unFreeze = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
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
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
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
    const vendor = await Vendor.findOne({ store_id: req.params.store_id });
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
    const { search, status, dateRange, recent, day, page, limit, method } =
      req.query;

    const vendorOrders = await Orders.aggregate([
      {
        $match: {
          cart: {
            $elemMatch: {
              productId: {
                $in: await Product.distinct("productId", {
                  store_id: vendorId,
                }),
              },
            },
          },
        },
      },
      {
        $project: {
          status: 1,
          shippingCost: 1,
          discount: 1,
          paymentMethod: 1,
          orderTime: "$createdAt",
          customerName: "$user_info.name",
          invoice: 1,
          totalAmount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$cart",
                    as: "item",
                    cond: {
                      $in: [
                        "$$item.productId",
                        await Product.distinct("productId", {
                          store_id: vendorId,
                        }),
                      ],
                    },
                  },
                },
                as: "item",
                in: "$$item.itemTotal",
              },
            },
          },
          id: 1,
          userId: "$user_info",
          cardInfo: 1,
          subTotal: 1,
          total: 1,
          cartNo: { $size: "$cart" },
          cart: {
            $filter: {
              input: "$cart",
              as: "item",
              cond: {
                $and: [
                  {
                    $in: [
                      "$$item.productId",
                      await Product.distinct("productId", {
                        store_id: vendorId,
                      }),
                    ],
                  },
                  { $gt: ["$$item.itemTotal", 0] },
                ],
              },
            },
          },
        },
      },
    ]);

    // quries-----------------------------start--------//
    const today = new Date();

    let filteredVendorOrders = vendorOrders;

    if (page && limit) {
      let pageNumber = parseInt(page);
      let limitNumber = parseInt(limit);
      if (pageNumber < 1 || limitNumber < 1) {
        res.status(400).send({ error: "Invalid page or limit" });
        return;
      }
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = pageNumber * limitNumber;
      filteredVendorOrders = filteredVendorOrders.slice(startIndex, endIndex);
    }

    if (search) {
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const searchQuery = search.toLowerCase();
        return (
          order.customerName.toLowerCase().includes(searchQuery) ||
          order.invoice.toString().includes(searchQuery)
        );
      });
    }

    if (status) {
      filteredVendorOrders = filteredVendorOrders.filter(
        (order) => order.status === status
      );
    }

    if (method) {
      filteredVendorOrders = filteredVendorOrders.filter(
        (order) => order.paymentMethod === method
      );
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      const startDateObj = new Date(startDate + "T00:00:00.000Z"); // add time zone offset
      const endDateObj = new Date(endDate + "T23:59:59.999Z"); // add time zone offset
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate.getTime() >= startDateObj.getTime() &&
          orderDate.getTime() <= endDateObj.getTime()
        );
      });
    }

    if (day === "5") {
      const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= fiveDaysAgo;
      });
    } else if (day === "7") {
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= sevenDaysAgo;
      });
    } else if (day === "15") {
      const fifteenDaysAgo = new Date(
        today.getTime() - 15 * 24 * 60 * 60 * 1000
      );
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= fifteenDaysAgo;
      });
    } else if (day === "30") {
      const thirtyDaysAgo = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      );
      filteredVendorOrders = filteredVendorOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= thirtyDaysAgo;
      });
    }
    // -----------------end---------------------------------//

    // Calculate earnings
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const yesterdayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );
    const yesterdayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const weekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const weekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalEarnings = vendorOrders.reduce((acc, order) => {
      if (order.status === "Delivered") {
        return acc + order.totalAmount;
      }
      return acc;
    }, 0);

    const todayEarnings = vendorOrders
      .filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate >= todayStart &&
          orderDate < todayEnd &&
          order.status === "Delivered"
        );
      })
      .reduce(
        (acc, order) => {
          acc.totalAmount += order.totalAmount;
          if (order.paymentMethod === "Cash") {
            acc.cashAmount += order.totalAmount;
          } else if (order.paymentMethod === "Credit") {
            acc.creditAmount += order.totalAmount;
          } else if (order.paymentMethod === "Card") {
            acc.cardAmount += order.totalAmount;
          }
          return acc;
        },
        {
          totalAmount: 0,
          cashAmount: 0,
          creditAmount: 0,
          cardAmount: 0,
        }
      );

    const yesterdayEarnings = vendorOrders
      .filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate >= yesterdayStart &&
          orderDate < yesterdayEnd &&
          order.status === "Delivered"
        );
      })
      .reduce(
        (acc, order) => {
          acc.totalAmount += order.totalAmount;
          if (order.paymentMethod === "Cash") {
            acc.cashAmount += order.totalAmount;
          } else if (order.paymentMethod === "Credit") {
            acc.creditAmount += order.totalAmount;
          } else if (order.paymentMethod === "Card") {
            acc.cardAmount += order.totalAmount;
          }
          return acc;
        },
        {
          totalAmount: 0,
          cashAmount: 0,
          creditAmount: 0,
          cardAmount: 0,
        }
      );

    const weeklyEarnings = vendorOrders
      .filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate >= weekStart &&
          orderDate < weekEnd &&
          order.status === "Delivered"
        );
      })
      .reduce(
        (acc, order) => {
          acc.totalAmount += order.totalAmount;
          if (order.paymentMethod === "Cash") {
            acc.cashAmount += order.totalAmount;
          } else if (order.paymentMethod === "Credit") {
            acc.creditAmount += order.totalAmount;
          } else if (order.paymentMethod === "Card") {
            acc.cardAmount += order.totalAmount;
          }
          return acc;
        },
        {
          totalAmount: 0,
          cashAmount: 0,
          creditAmount: 0,
          cardAmount: 0,
        }
      );

    const monthlyEarnings = vendorOrders
      .filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate >= monthStart &&
          orderDate < monthEnd &&
          order.status === "Delivered"
        );
      })
      .reduce(
        (acc, order) => {
          acc.totalAmount += order.totalAmount;
          if (order.paymentMethod === "Cash") {
            acc.cashAmount += order.totalAmount;
          } else if (order.paymentMethod === "Credit") {
            acc.creditAmount += order.totalAmount;
          } else if (order.paymentMethod === "Card") {
            acc.cardAmount += order.totalAmount;
          }
          return acc;
        },
        {
          totalAmount: 0,
          cashAmount: 0,
          creditAmount: 0,
          cardAmount: 0,
        }
      );

    const lastMonthlyEarnings = vendorOrders
      .filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate >= lastMonthStart &&
          orderDate < lastMonthEnd &&
          order.status === "Delivered"
        );
      })
      .reduce(
        (acc, order) => {
          acc.totalAmount += order.totalAmount;
          if (order.paymentMethod === "Cash") {
            acc.cashAmount += order.totalAmount;
          } else if (order.paymentMethod === "Credit") {
            acc.creditAmount += order.totalAmount;
          } else if (order.paymentMethod === "Card") {
            acc.cardAmount += order.totalAmount;
          }
          return acc;
        },
        {
          totalAmount: 0,
          cashAmount: 0,
          creditAmount: 0,
          cardAmount: 0,
        }
      );

    const totalOrders = vendorOrders.length;
    const deliveredOrders = vendorOrders.filter(
      (item) => item.status === "Delivered"
    ).length;
    const pendingOrders = vendorOrders.filter(
      (item) => item.status === "Pending"
    ).length;
    const processingOrders = vendorOrders.filter(
      (item) => item.status === "Processing"
    ).length;
    const canceledOrders = vendorOrders.filter(
      (item) => item.status === "Canceled"
    ).length;

    const bestSellingProducts = vendorOrders.reduce((acc, order) => {
      order.cart.forEach((item) => {
        const productId = item.productId;
        const quantity = item.quantity;
        const title = item.title; // get the product title from the cart item
        if (!acc[productId]) {
          acc[productId] = { quantity: 0, title };
        }
        acc[productId].quantity += quantity;
      });
      return acc;
    }, {});

    const sortedBestSellingProducts = Object.entries(bestSellingProducts).sort(
      (a, b) => b[1].quantity - a[1].quantity
    );

    const topProducts = sortedBestSellingProducts.slice(0, 4);

    if (id) {
      const orderId = mongoose.Types.ObjectId(id);
      const orderData = vendorOrders.filter((order) => {
        return order._id.equals(orderId);
      });
      res.send(orderData);
    } else if (recent) {
      const recentOrders = vendorOrders
        .sort((a, b) => b.orderTime - a.orderTime) // sort by createdAt in descending order (newest first)
        .slice(0, 5); // limit to 5 recent orders
      res.send(recentOrders);
    } else if (
      search ||
      status ||
      dateRange ||
      day ||
      page ||
      limit ||
      method
    ) {
      res.send({ filteredVendorOrders });
    } else {
      res.send({
        totalOrders,
        deliveredOrders,
        pendingOrders,
        processingOrders,
        canceledOrders,
        topProducts,
        earnings: {
          total: totalEarnings,
          today: todayEarnings,
          yesterday: yesterdayEarnings,
          weekly: weeklyEarnings,
          monthly: monthlyEarnings,
          lastmonth: lastMonthlyEarnings,
        },
        vendorOrders,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  resetPassword,
  forgetPassword,
  loginVendor,
  updateVendorlogin,
  updateVendorAddress,
  getAllVendors,
  getVendorsById,
  registerVendor,
  ratingSystem,
  updateVendor,
  categorySystem,
  verify,
  unverify,
  freeze,
  unFreeze,
  activate,
  deActivate,
  addStaff,
  updateStaff,
  deleteStaff,
  getAllStaffs,
  findStaffById,
  vendorOrders,
  getVendorsByStoreId,
};
