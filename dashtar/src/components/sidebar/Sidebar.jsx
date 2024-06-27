import React from "react";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

const Sidebar = ({handleLogout}) => {
  return (
    <>
      <DesktopSidebar handleLogout={handleLogout} />
      <MobileSidebar handleLogout={handleLogout} />
    </>
  );
};

export default Sidebar;
