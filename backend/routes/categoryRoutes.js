const express = require('express');
const router = express.Router();
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getStoreTypes,
  getAllCategories,
  getCategoriesByStore,
  getAllCategoriesByStore,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory

} = require('../controller/categoryController');
const { isAuth } = require("../config/auth");

//add a category
router.post('/add', addCategory);

//add all category
router.post('/add/all', addAllCategory);

//get only showing category
router.get('/show', getShowingCategory);

router.get('/stores', getStoreTypes);

//get all category
router.get('/', getAllCategory);
//get all category
router.get('/all', getAllCategories);
//
router.get("/storetype", isAuth, getCategoriesByStore);

router.get("/allstoretype", isAuth, getAllCategoriesByStore);

//get a category
router.get('/:id', getCategoryById);

//update a category
router.put('/:id', updateCategory);

//show/hide a category
router.put('/status/:id', updateStatus);

//delete a category
router.delete('/:id', deleteCategory);

// delete many category
router.patch('/delete/many', deleteManyCategory);

// update many category
router.patch('/update/many', updateManyCategory);

module.exports = router;
