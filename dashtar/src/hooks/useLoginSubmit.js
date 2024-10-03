import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

//internal import
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { removeSetting } from "@/reduxStore/slice/settingSlice";
import VendorServices from "@/services/VendorServices";

const useLoginSubmit = () => {
  const reduxDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const [unAuthModal, setUnAuthModal] = useState(false);
  const [errMessage, setErrMessage] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({
    auth_id,
    auth_password,
    store_id,
    name,
    email,
    verifyEmail,
    password,
    role,
  }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;
    // return;
    console.log(store_id);

    if (location.pathname === "/login") {
      reduxDispatch(removeSetting("globalSetting"));
      // AdminServices.loginAdmin({ auth_id, auth_password }) wizicodes
      VendorServices.login({ store_id, email, password })
        .then((res) => {
          if (res) {
            setLoading(false);
            notifySuccess("Login Success!");
            dispatch({ type: "USER_LOGIN", payload: res });
            Cookies.set("userInfo", JSON.stringify(res), {
              // expires: cookieTimeOut,
              sameSite: "None",
              secure: true,
            });
            history.replace("/");
            console.log(role);
          }
        })
        .catch((err) => {
          err?.response?.status !== 500
            ? notifyError(err?.response?.data?.message || err?.message)
            : err?.response?.status === 500 && setUnAuthModal(true),
            setErrMessage(err?.response?.data?.message || err?.message);
          // notifyError(err ? err?.response?.data?.message : err?.message);
          setLoading(false);
        });
    }

    if (location.pathname === "/signup") {
      AdminServices.registerAdmin({ name, email, password, role })
        .then((res) => {
          if (res) {
            setLoading(false);
            notifySuccess("Register Success!");
            dispatch({ type: "USER_LOGIN", payload: res });
            Cookies.set("userInfo", JSON.stringify(res), {
              expires: cookieTimeOut,
              sameSite: "None",
              secure: true,
            });
            history.replace("/");
          }
        })
        .catch((err) => {
          notifyError(err?.response?.data?.message || err?.message);
          // notifyError(err ? err?.response?.data?.message : err?.message);
          setLoading(false);
        });
    }

    if (location.pathname === "/forgot-password") {
      VendorServices.forgetPassword({ verifyEmail, store_id })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
          console.log(res);
        })
        .catch((err) => {
          setLoading(false);
          notifyError(err?.response?.data?.message || err?.message);
          console.log(err);
          // notifyError(err ? err?.response?.data?.message : err?.message);
        });
    }
  };

  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
    unAuthModal,
    setUnAuthModal,
    errMessage,
    setErrMessage,
  };
};

export default useLoginSubmit;
