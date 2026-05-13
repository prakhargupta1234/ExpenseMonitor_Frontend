import { useContext } from "react";
import MenuBar from "./menuBar";
import SideBar from "./sideBar";
import { AppContext } from "../context/AppContext";

const Dashboard = ({ children, activeMenu }) => {
    const { user, sidebarCollapsed } = useContext(AppContext);

    return (
        <div className="h-screen bg-[#f8fafb] flex flex-col overflow-hidden">
            <MenuBar activeMenu={activeMenu} />
            {user && (
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Desktop Sidebar - Always visible, width changes dynamically */}
                    <div className={`hidden lg:block shrink-0 h-full sidebar-transition ${sidebarCollapsed ? 'w-[80px]' : 'w-[270px]'}`}>
                        <SideBar activeMenu={activeMenu} />
                    </div>
                    {/* Main Content - Adjusts width dynamically */}
                    <div className="flex-1 w-full h-full overflow-y-auto content-transition bg-gray-50/30">
                        <main className="min-h-full p-4 sm:p-6 lg:p-10">
                            <div className="max-w-[1400px] mx-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;