import React from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";

const DesktopSidebar = ({handleLogout}) => {
  return (
    <aside className="z-30 flex-shrink-0 hidden shadow-sm w-64 overflow-y-auto bg-white dark:bg-gray-800 lg:block">
      <SidebarContent handleLogout={handleLogout} />
    </aside>
  );
};

export default DesktopSidebar;
