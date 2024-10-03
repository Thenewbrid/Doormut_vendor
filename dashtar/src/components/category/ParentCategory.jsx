import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";

import Multiselect from "multiselect-react-dropdown";
import Tree from "rc-tree";

//internal import
import useAsync from "@/hooks/useAsync";
import { notifySuccess } from "@/utils/toast";
import CategoryServices from "@/services/CategoryServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useState } from "react";

const ParentCategory = ({
  selectedCategory,
  setSelectedCategory,
  defaultCategory,
  setDefaultCategory,
}) => {
  const { data, loading } = useAsync(CategoryServices?.getCategoriesByStore);
  const { showingTranslateValue } = useUtilsFunction();
  const [subCategory, setSubCategory] = useState();
  const STYLE = `
  .rc-tree-child-tree {
    display: block;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push({
        title: category.name,
        key: category._id,
        children:
          category?.children?.length > 0 && renderCategories(category.children),
      });
    }

    return myCategories;
  };

  const findObject = (obj, target) => {
    return obj._id === target
      ? obj
      : obj?.children?.reduce(
          (acc, obj) => acc ?? findObject(obj, target),
          undefined
        );
    // if (obj._id === target) return obj;

    // for (let c of obj.children) {
    //   let x = findObject(target, c);
    //   console.log('c', c);
    //   if (x) return x;
    // }
  };

  const handleSelectCategory = (id) => {
    // const handleSelect = (key) => {
    // const results = data.map((obj) => findObject(obj, key));
    // console.log(data);
    // results.forEach((result) => {
    //   if (result !== undefined) {
    //     const getCategory = selectedCategory.filter(
    //       (value) => value._id === result._id
    //     );

    //     if (getCategory.length !== 0) {
    //       return notifySuccess("This category already selected!");
    //     }

    //     setSelectedCategory((pre) => [
    //       ...pre,
    //       {
    //         _id: result?._id,
    //         name: result?.name,
    //       },
    //     ]);
    //     setDefaultCategory(() => [
    //       {
    //         _id: result?._id,
    //         name: result?.name,
    //       },
    //     ]);
    //   }
    // });

    const category = data?.find((item) => item._id === id);
    const subCate = category?.children?.map((item) => item);

    setSubCategory(subCate);
    console.log(subCate);
    console.log(data);
  };

  const addParent = () => {
    const clickedItems = data?.find((child) => {
      const children = child.children.map((item) => item._id);
      return subCategory.some((item) => children.includes(item._id));
    });

    const getCategory = selectedCategory.filter(
      (value) => value._id === clickedItems?._id
    );

    if (getCategory.length === 0) {
      if (clickedItems) {
        setSelectedCategory([
          ...selectedCategory,
          {
            _id: clickedItems._id,
            name: clickedItems.name,
          },
        ]);
      }
    }

    // Remove parent category if all its child categories are unchecked
    const parentCategoriesToRemove = selectedCategory.filter((category) => {
      const hasSubcategories = subCategory.some(
        (subcat) => subcat._id === category._id
      );
      const hasChildren = data.some((child) => child._id === category._id);
      const allChildrenUnchecked = subCategory.every(
        (subcat) => !selectedCategory.some((cat) => cat._id === subcat._id)
      );
      return !hasSubcategories && !hasChildren && allChildrenUnchecked;
    });

    if (parentCategoriesToRemove.length > 0) {
      setSelectedCategory(
        selectedCategory.filter(
          (category) => !parentCategoriesToRemove.includes(category)
        )
      );
    }

    console.log({ clickedItems, parentCategoriesToRemove });
  };
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  console.log(selectedCategory);
  const handleRemove = (v) => {
    setSelectedCategory(v);
  };
  const [selectedName, setSelectedName] = useState("");
  return (
    <>
      <div className="mb-2">
        {/*--    <Multiselect
          displayValue="name"
          groupBy="name"
          isObject={true}
          hidePlaceholder={true}
          onKeyPressFn={function noRefCheck() {}}
          onRemove={(v) => handleRemove(v)}
          onSearch={function noRefCheck() {}}
          onSelect={(v) => handleSelect(v)}
          // options={selectedCategory}
          selectedValues={selectedCategory}
          placeholder={"Select Category"}
        ></Multiselect>--*/}
        <Select
          onChange={(e) => {
            handleSelectCategory(e.target.value);
            setSelectedName(e.target.options[e.target.selectedIndex].label);
          }}
        >
          <option defaultValue hidden>
            Select Category
          </option>
          {data?.map((item) => {
            return (
              <option value={item._id} label={item.name}>
                {item.name}
              </option>
            );
          })}
        </Select>
      </div>
      <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
        <h1 className="text-gray-400">{selectedName}</h1>

        <div className="col-span-8 sm:col-span-4">
          {subCategory?.map((item) => (
            <div className="w-full flex items-center gap-x-4 mb-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={selectedCategory.some(
                  (value) => value._id === item._id
                )}
                onChange={(e) => {
                  // const stillChecked = selectedCategory.filter(
                  //   (value) => value._id !== item._id
                  // );
                  const parentCategory = data?.find((category) =>
                    category.children.some((child) => child._id === item._id)
                  );
                  if (e.target.checked) {
                    const getCategory = selectedCategory.filter(
                      (value) => value._id === parentCategory?._id
                    );
                    console.log({ getCategory });

                    setSelectedCategory([
                      ...selectedCategory,
                      {
                        _id: item._id,
                        name: item.name,
                      },
                    ]);
                    setDefaultCategory([
                      {
                        _id: item._id,
                        name: item.name,
                      },
                    ]);
                  } else {
                    setSelectedCategory(
                      selectedCategory.filter((value) => value._id !== item._id)
                    );
                    setDefaultCategory(null);
                  }
                }}
              />
              <label>{item.name}</label>
            </div>
          ))}
        </div>
      </div>
      {/*--  {!loading && data !== undefined && (
        <div className="draggable-demo capitalize">
          <style dangerouslySetInnerHTML={{ __html: STYLE }} />
          <Tree
            expandAction="click"
            treeData={renderCategories(data)}
            // defaultCheckedKeys={id}
            onSelect={(v) => handleSelect(v[0])}
            motion={motion}
            animation="slide-up"
          />
        </div>
      )}
      --*/}
    </>
  );
};

export default ParentCategory;
