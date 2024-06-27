import React, { useContext, useState } from "react";
import { NavLink, Route, useHistory,Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button, WindmillContext } from "@windmill/react-ui";
import { IoLogOutOutline } from "react-icons/io5";

//internal import
import sidebar from "@/routes/sidebar";
import admin from "@/routes/adminSidebar";
import cashier from "@/routes/cashier";
import logoLight from "@/assets/img/logo/logo-light.png";
import logoDark from "@/assets/img/logo/logo-dark.svg";
import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import { AdminContext } from "@/context/AdminContext";



const SidebarContent = ({handleLogout}) => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
   const { state, dispatch } = useContext(AdminContext);
   const { adminInfo } = state;
  
   
  const info = () => {
    dispatch({ type: "USER_LOGIN", payload: res });
    Cookies.get("adminInfo");
  }
  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    handleLogout();
    // window.location.replace(`${import.meta.env.VITE_APP_ADMIN_DOMAIN}/login`);
  };


  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className=" text-gray-900 dark:text-gray-200" href="/dashboard">
        {mode === "dark" ? (
          <img src={logoLight} alt="kachabazar" width="135" className="pl-6" />
        ) : (
          <img src={logoDark} alt="kachabazar" width="135" className="pl-6" />
        )}
      </a>
      {/* DASHBOARD CONTENT FOR ADMIN */}
      {adminInfo.role === "Admin" && (
      <ul className="mt-8">
        {admin.map((route) =>
          route.routes ? (
            <SidebarSubMenu route={route} key={route.name} />
          ) : (
            <li className="relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-emerald-700 dark:hover:text-gray-200"
                activeClassName="text-emerald-500 dark:text-gray-100"
                activeStyle={{
                  color: "#0d9e6d",
                }}
                rel="noreferrer"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-4">{t(`${route.name}`)}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      )}
      {/* END OF DASHBOARD CONTENT FOR ADMIN */}
      {/* DASHBOARD CONTENT FOR INVENTORY-MANAGER */}
      {adminInfo.role === "Manager" && (
        <ul className="mt-8">
          {sidebar.map((route) =>
            route.routes ? (
              <SidebarSubMenu route={route} key={route.name} />
            ) : (
              <li className="relative" key={route.name}>
                <NavLink
                  exact
                  to={route.path}
                  target={`${route?.outside ? "_blank" : "_self"}`}
                  className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-emerald-700 dark:hover:text-gray-200"
                  activeClassName="text-emerald-500 dark:text-gray-100"
                  activeStyle={{
                    color: "#0d9e6d",
                  }}
                  rel="noreferrer"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  <route.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-4">{t(`${route.name}`)}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>
      )}
      {/* END OF DASHBOARD CONTENT FOR INVENTORY-MANAGER */}
      {/* DASHBOARD CONTENT FOR CASHIER */}
      {adminInfo.role === "Cashier" && (
        <ul className="mt-8">
          {cashier.map((route) =>
            route.routes ? (
              <SidebarSubMenu route={route} key={route.name} />
            ) : (
              <li className="relative" key={route.name}>
                <NavLink
                  exact
                  to={route.path}
                  target={`${route?.outside ? "_blank" : "_self"}`}
                  className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-emerald-700 dark:hover:text-gray-200"
                  activeClassName="text-emerald-500 dark:text-gray-100"
                  activeStyle={{
                    color: "#0d9e6d",
                  }}
                  rel="noreferrer"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  <route.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-4">{t(`${route.name}`)}</span>
                </NavLink>
              </li>
            )
          )}
        </ul>
      )}
      {/* END OF DASHBOARD CONTENT FOR CASHIER */}
      {/* <ul className="mt-8">
        {cashier.map((route) =>
          route.routes ? (
            <SidebarSubMenu route={route} key={route.name} />
          ) : (
            <li className="relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className="px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-emerald-700 dark:hover:text-gray-200"
                // activeClassName="text-emerald-500 dark:text-gray-100"
                activeStyle={{
                  color: "#0d9e6d",
                }}
                rel="noreferrer"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-4">{t(`${route.name}`)}</span>
              </NavLink>
            </li>
          )
        )}
      </ul> */}
      <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
        <Button onClick={handleLogOut} size="large" className="w-full">
          <span className="flex items-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm">{t("LogOut")}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default SidebarContent;
