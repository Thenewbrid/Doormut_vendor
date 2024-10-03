const express = require("express");
const router = express.Router();
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getStoreTypes,
  getAllCategories,
  getCategoriesByStore,
  bulkAddCategory,
  bulkEditCategory,
  getAllCategoriesByStore,
  addMultipleCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateMultipleCategory,
  getCategoriesById,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory,
} = require("../controller/categoryController");
const { isAuth } = require("../config/auth");

//get only showing category
router.get("/show", getShowingCategory);

router.get("/stores", getStoreTypes);

//get all category
router.get("/", getAllCategory);
//get all category
router.get("/all", getAllCategories);
//
router.get("/storetype", isAuth, getCategoriesByStore);

router.get("/allstoretype", isAuth, getAllCategoriesByStore);

router.get("/parent/:id", getCategoriesById);

//get a category
router.get("/:id", getCategoryById);


router.post("/upMulti", addMultipleCategory);

//add a category
router.post("/add", addCategory);

//add all category
router.post("/add/all", addAllCategory);



//add parent category and  subcategories at once
router.post("/bulkadd", bulkAddCategory);


//update a category
router.put("/:id", updateCategory);

//update a category
router.put("/update/multi", updateMultipleCategory);

//show/hide a category
router.put("/status/:id", updateStatus);


// delete many category
router.patch("/delete/many", deleteManyCategory);

// update many category
router.patch("/update/many", updateManyCategory);


//update parent category and add subcategories at once
router.patch("/bulkedit/:id", bulkEditCategory);


//delete a category
router.delete("/:id", deleteCategory);

module.exports = router;
