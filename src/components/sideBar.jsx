import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User, LogOut } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SideBar = ({ activeMenu, onMenuItemClick }) => {
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        if (onMenuItemClick) onMenuItemClick();
        navigate("/login");
    }

    return (
        <div className="w-full h-full bg-white border-r border-gray-200 p-5 flex flex-col overflow-y-auto">
            <div>
                <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 ">
                    {user?.profileImageUrl ? (
                        <img src={user?.profileImageUrl || ""} alt="profile image"
                            className=" w-20 h-20 bg-slate-400 rounded-full object-cover" />
                    ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-500" />
                        </div>
                    )}

                    <h5 className="text-gray-900 font-medium leading-6 text-center">{user?.name || ""}</h5>

                </div>

                {SIDE_BAR_DATA.map((item, index) => (
                    <button
                        onClick={() => {
                            navigate(item.path);
                            if (onMenuItemClick) onMenuItemClick();
                        }}
                        key={`menu_${index}`}
                        className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors duration-200 ${activeMenu === item.label ? "text-white bg-black " : "hover:bg-gray-100"}`}
                    >
                        <item.icon className="text-xl" />
                        {item.label}
                    </button>

                ))}
            </div>
            <div className="mt-10 pt-5 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200"
                >
                    <LogOut className="text-xl" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default SideBar;