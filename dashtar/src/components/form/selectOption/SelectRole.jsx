import React, { useContext } from "react";
import { Select } from "@windmill/react-ui";
import { AdminContext } from "@/context/AdminContext";

const SelectRole = ({ setRole, register, name, label }) => {
  const { state, dispatch } = useContext(AdminContext);
  const { userInfo } = state;
  return (
    <>
      <Select
        onChange={(e) => setRole(e.target.value)}
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="" defaultValue hidden>
          Staff role
        </option>
        <option value="Admin">Admin</option>
        <option value="Super Admin">Super Admin</option>
        {/* <option value="CEO">CEO</option> */}
        <option value="Manager">Inventory Manager</option>
        <option value="Cashier">Cashier</option>
        {/* <option value="Driver"> Driver </option> */}
        {/* <option value="Security Guard">Security Guard</option> */}
        {/* <option value="Deliver Person">Delivery Person</option> */}
      </Select>
    </>
  );
};

export default SelectRole;
