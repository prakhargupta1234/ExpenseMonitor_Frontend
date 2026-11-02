import { useContext } from "react";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";

import { AppContext } from "../context/AppContext";

const Dashboard = ({ children, activeMenu }) => {
    const { user, sidebarCollapsed } = useContext(AppContext);

    return (
        <div className="h-screen bg-[#f8fafb] flex overflow-hidden">
            {/* Desktop Sidebar - Always visible, full height from top to bottom */}
            {user && (
                <div className={`hidden lg:block shrink-0 h-full sidebar-transition ${sidebarCollapsed ? 'w-[70px]' : 'w-[250px]'}`}>
                    <SideBar activeMenu={activeMenu} />
                </div>
            )}
            {/* Right side: Top Header + Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <MenuBar activeMenu={activeMenu} />
                <div className="flex-1 w-full h-full overflow-y-auto content-transition bg-gray-50/30">
                    <main className="min-h-full p-4 sm:p-5 lg:p-6 animate-page-enter">
                        <div className="w-full max-w-[1600px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
