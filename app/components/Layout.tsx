import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      
      <Outlet />
    </div>
  );
}