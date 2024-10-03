const Category = require("../models/Category");
const mongoose = require("mongoose");

const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple category
const addAllCategory = async (req, res) => {
  try {
    const existingCategories = await Category.find({
      name: { $in: req.body.map((category) => category.name) },
      type: "parentCategory",
    });

    const duplicateCategories = req.body.filter((category) => {
      return existingCategories.some((existingCategory) => {
        return (
          existingCategory.name === category.name &&
          existingCategory.type === category.type
        );
      });
    });

    if (duplicateCategories.length > 0) {
      return res.status(400).send({
        message: "This parent category already exists",
      });
    }

    await Category.insertMany(req.body);

    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).send({
      message: err.message,
    });
  }
};

const getStoreTypes = async (req, res) => {
  try {
    const storeTypes = Category.schema.path("storeType").enumValues;
    res.json(storeTypes);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show category
const getShowingCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "show" }).sort({
      _id: -1,
    });

    const categoryList = readyToParentAndChildrenCategory(categories);
    // console.log("category list", categoryList.length);
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all category parent and child
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    const categoryList = readyToParentAndChildrenCategory(categories);
    //  console.log('categoryList',categoryList)
    res.send(categoryList);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// wizicodes: get categories by storeType
const getCategoriesByStore = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    const categoryList = readyToParentAndChildrenCategory(categories).filter(
      (items) => items.storeType.includes(req.user.store_type)
    );
    //  console.log('categoryList',categoryList)
    res.send(categoryList);
    console.log(req.user.role);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// wizicodes: get categories by storeType
const getCategoriesById = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });
    const id = mongoose.Types.ObjectId(req.params.id);
    //  const orderData = vendorOrders.find((order) => {
    //    return order._id.equals(orderId);
    //  });
    const categoryList = readyToParentAndChildrenCategory(categories).find(
      (items) => items._id.equals(id)
    );
    //  console.log('categoryList',categoryList)
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      _id: -1,
    });

    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategoriesByStore = async (req, res) => {
  try {
    const categories = await Category.find({
      storeType: { $in: [req.user.store_type] }, // updated to check if req.user.store_type is in the storeType array
    }).sort({
      _id: -1,
    });

    if (categories.length > 0) {
      res.send(categories);
    } else {
      res.status(404).send({
        message: "No categories found for the given store type",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = { ...category.name, ...req.body.name };
      category.description = {
        ...category.description,
        ...req.body.description,
      };
      category.storeType = req.body.storeType;
      category.icon = req.body.icon;
      category.status = req.body.status;
      category.parentId = req.body.parentId
        ? req.body.parentId
        : category.parentId;
      category.parentName = req.body.parentName;

      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateMultipleCategory = async (req, res) => {
  try {
    const updates = req.body.updates;

    if (!updates) {
      return res.status(400).json({ message: "Cannot be empty!" });
    }

    const bulkWriteAction = updates.map((update) => {
      return {
        updateOne: {
          filter: { _id: update._id },
          update: { $set: update.fields },
        },
      };
    });

    const result = await Category.bulkWrite(bulkWriteAction);
    res.json({ message: `Updated ${result.modifiedCount} categories` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addMultipleCategory = async (req, res) => {
  try {
    const categories = req.body;

    // Delete existing categories with the same parent name
    // await Category.deleteMany({
    //   parentName: { $in: categories.map((category) => category.parentName) },
    // });

    const parentNames = categories.map((update) => update.parentName);

    await Category.deleteMany({
      $or: [
        { parentName: { $in: parentNames } },
        { name: { $in: parentNames } },
      ],
    });

    // Add new categories
    const newCategories = categories.map((category) => new Category(category));
    await Category.insertMany(newCategories);

    res.status(200).send({
      message: "Categories added successfully!",
    });
    console.log(parentNames);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const bulkAddCategory = async (req, res) => {
  try {
    const newCategory = req.body;
    // Check if the parent category already exists
    const existingParentCategory = await Category.findOne({
      name: newCategory.name,
      type: "parentCategory",
    });

    if (existingParentCategory) {
      return res
        .status(400)
        .send({ message: "Parent category already exists!" });
    }
    // Create a new category
    const category = new Category({
      name: newCategory.name,
      description: newCategory.description,
      slug: newCategory.slug,
      storeType: newCategory.storeType,
      type: "parentCategory",
      icon: newCategory.icon,
      status: newCategory.status,
    });

    // Handle subcategory additions in bulk
    if (newCategory.subcategories) {
      const subcategories = newCategory.subcategories;
      const bulkWriteActions = [];

      for (const subcategory of subcategories) {
        // Create a new subcategory
        bulkWriteActions.push({
          insertOne: {
            document: {
              name: subcategory.name,
              type: "subCategory",
              parentId: category._id,
              parentName: category.name,
              icon: subcategory.icon,
              status: subcategory.status,
            },
          },
        });
      }

      await Category.bulkWrite(bulkWriteActions);
    }

    // Save the new category
    await category.save();
    res.send({ message: "Category added successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const bulkEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Update category fields
    category.name = updatedCategory.name;
    category.description = updatedCategory.description;
    category.slug = updatedCategory.slug;
    category.storeType = updatedCategory.storeType;
    // category.type = updatedCategory.type;
    // category.parentId = updatedCategory.parentId;
    // category.parentName = updatedCategory.parentName;
    category.id = updatedCategory.id;
    category.icon = updatedCategory.icon;
    category.status = updatedCategory.status;

    // Handle subcategory updates in bulk
    // ...

    if (updatedCategory.subcategories) {
      const subcategories = updatedCategory.subcategories;
      const bulkWriteActions = [];

      for (const subcategory of subcategories) {
        if (subcategory._id) {
          if (subcategory.delete === true) {
            // Delete subcategory if delete field is true
            bulkWriteActions.push({
              deleteOne: {
                filter: { _id: subcategory._id },
              },
            });
          } else {
            // Update existing subcategory
            bulkWriteActions.push({
              updateOne: {
                filter: { _id: subcategory._id },
                update: {
                  $set: {
                    name: subcategory.name,
                    // description: subcategory.description,
                    // slug: subcategory.slug,
                    // type: subcategory.type,
                    parentId: categoryId,
                    parentName: category.name,
                    icon: subcategory.icon,
                    status: subcategory.status,
                  },
                },
              },
            });
          }
        } else {
          // Create new subcategory
          bulkWriteActions.push({
            insertOne: {
              document: {
                name: subcategory.name,
                // description: subcategory.description,
                // slug: subcategory.slug,
                type: subcategory.type,
                parentId: categoryId,
                parentName: category.name,
                icon: subcategory.icon,
                status: subcategory.status,
              },
            },
          });
        }
      }

      await Category.bulkWrite(bulkWriteActions);
    }

    // ...
    await category.save();
    res.send({ message: "Category updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// udpate many category
const updateManyCategory = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Category.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Categories update successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Category ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single category delete
const deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentName: req.body.parentName });
    res.status(200).send({
      message: req.body.parentName,
    });
    console.log(req.body.parentName);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children category
  // Category.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Category Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple category delete
const deleteManyCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    await Category.deleteMany({ parentName: req.body.names });
    await Category.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenCategory = (categories, parentName = null) => {
  const categoryList = [];
  let Categories;
  if (parentName == null) {
    Categories = categories.filter((cat) => cat.parentName == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentName == parentName);
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      id: cate.id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      storeType: cate.storeType,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate.name),
    });
  }

  return categoryList;
};

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getCategoriesByStore,
  getAllCategoriesByStore,
  addMultipleCategory,
  bulkAddCategory,
  bulkEditCategory,
  getCategoriesById,
  getStoreTypes,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateMultipleCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  updateManyCategory,
};
