import { useContext } from "react";
import MenuBar from "./menuBar";
import SideBar from "./sideBar";
import { AppContext } from "../context/AppContext";
const Dashboard = ({ children, activeMenu }) => {
    const { user } = useContext(AppContext);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <MenuBar activeMenu={activeMenu} />
            {user && (
                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden lg:block w-64 shrink-0">
                        <SideBar activeMenu={activeMenu} />
                    </div>
                    <div className="flex-1 w-full overflow-x-hidden p-4 sm:p-6">{children}</div>
                </div>
            )}
        </div>
    )
}

export default Dashboard;