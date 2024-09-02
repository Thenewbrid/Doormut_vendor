import React, { useContext, Suspense, useEffect, lazy, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import moment from "moment";

//internal import
import Main from "@/layout/Main";
import routes from "@/routes/index";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/context/SidebarContext";
import ThemeSuspense from "@/components/theme/ThemeSuspense";
import Modal from "@/components/popup/Modal";
import { ModalContext } from "@/context/ModalContext";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
const Page404 = lazy(() => import("@/pages/404"));

const Layout = () => {
  const { isSidebarOpen, closeSidebar, navBar } = useContext(SidebarContext);
  let location = useLocation();

  const { state } = useContext(AdminContext);
  const { userInfo } = state;

  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (userInfo?.role === "Admin") {
      setRoleId("666b030efaad2fc5994461a5");
    } else if (userInfo?.role === "Manager") {
      setRoleId("666b07a9faad2fc599446283");
    } else if (userInfo?.role === "Cashier") {
      setRoleId("666b07cefaad2fc59944628a");
    } else {
      setRoleId("");
    }
  }, [userInfo.role, roleId]);

  const isOnline = navigator.onLine;

  // timeid for admin
  // 666b030efaad2fc5994461a5
  // 666b07a9faad2fc599446283
  // 666b07cefaad2fc59944628a

  const currentTime = moment().format("h:mm A");
  console.log(currentTime); // Output: "3:00 PM"
  const updateTime = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:5055/api/time/${roleId}`,
        data
      );
      // toast.success("Closing time set successfully");
      return response.data;
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // For The PopUp Modal

  const { showModal, setShowModal } = useContext(ModalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTime, setSelectedTime] = useState({
    hours: "12",
    minutes: "0",
    dayPart: "AM",
  });

  useEffect(() => {
    formatTime(selectedTime);
  }, [selectedTime]);

  const formatTime = (time) => {
    const hours = time.hours < 10 ? `0${time.hours}` : `${time.hours}`;
    const minutes = time.minutes < 10 ? `0${time.minutes}` : `${time.minutes}`;
    return `${hours}:${minutes} ${time.dayPart}`;
  };

  useEffect(() => {
    const modalState = localStorage.getItem("modalOpen");
    if (modalState) {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        localStorage.setItem("modalOpen", true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const data = {
    openingTime: currentTime,
    closingTime: formatTime(selectedTime),
  };

  const handleCloseModal = () => {
    localStorage.removeItem("modalOpen");
    setIsModalOpen(false);
  };

  const handleLogout = (selecteTime) => {
    setSelectedTime(selecteTime);
    localStorage.removeItem("modalOpen");
    localStorage.remove(formatTime(selectedTime));
    setShowModal(false);
  };

  const saveTime = () => {
    updateTime(data);
    setIsModalOpen(false);
    localStorage.setItem("Closing Time", formatTime(selectedTime));
    Cookies.set("Closing Time", JSON.stringify(formatTime(selectedTime)));
  };

  return (
    <>
      {!isOnline && (
        <div className="flex justify-center bg-red-600 text-white">
          You are in offline mode!{" "}
        </div>
      )}
      {/* // wizicodes */}
      <div
        className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${
          isSidebarOpen && "overflow-hidden"
        }`}
      >
        {navBar && <Sidebar handleLogout={handleLogout} />}

        <div className="flex flex-col flex-1 w-full">
          <Header handleLogout={handleLogout} />
          <Main>
            <Suspense fallback={<ThemeSuspense />}>
              <Switch>
                {routes.map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`${route.path}`}
                      render={(props) => <route.component {...props} />}
                    />
                  ) : null;
                })}
                <Redirect exact from="/" to="/dashboard" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </Main>
        </div>
      </div>
      {/* MODA POPUP */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        saveTime={saveTime}
      />
      {/* END OF MODAL POPUP */}
    </>
  );
};

export default Layout;
