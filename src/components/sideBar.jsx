import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const SideBar = ({ activeMenu, onMenuItemClick }) => {
    const { user, setUser, sidebarCollapsed, toggleSidebar } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        if (onMenuItemClick) onMenuItemClick();
        navigate("/login");
    };

    const handleNav = (path) => {
        navigate(path);
        if (onMenuItemClick) onMenuItemClick();
    };

    return (
        <div className={`h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden sidebar-transition ${sidebarCollapsed ? 'w-[80px]' : 'w-[270px]'}`}>
            {/* Collapse Toggle - Desktop only */}
            <div className={`hidden lg:flex items-center px-3 pt-3 ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
                <button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* User Profile Section */}
            <div className={`flex flex-col items-center gap-2 px-3 py-4 border-b border-gray-50 ${sidebarCollapsed ? 'py-3' : 'py-5'}`}>
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt="profile"
                        className={`rounded-full object-cover border-2 border-emerald-100 shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'w-11 h-11' : 'w-16 h-16'}`}
                    />
                ) : (
                    <div className={`bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'w-11 h-11' : 'w-16 h-16'}`}>
                        <span className={`text-white font-bold ${sidebarCollapsed ? 'text-sm' : 'text-xl'}`}>
                            {(user?.name || user?.fullName || "U").charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                {!sidebarCollapsed && (
                    <div className="text-center animate-fade-in min-w-0 w-full px-2">
                        <h5 className="text-sm font-semibold text-gray-900 truncate">{user?.name || user?.fullName || ""}</h5>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className={`flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-hidden ${sidebarCollapsed ? 'no-scrollbar' : ''}`}>
                {SIDE_BAR_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            onClick={() => handleNav(item.path)}
                            key={`menu_${index}`}
                            className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                                sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                            } ${
                                isActive
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon className={`shrink-0 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'}`} size={20} />
                            {!sidebarCollapsed && (
                                <span className={`text-[14px] font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                            {sidebarCollapsed && (
                                <span className="sidebar-tooltip">{item.label}</span>
                            )}
                            {isActive && !sidebarCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-3 border-t border-gray-100 space-y-1 overflow-hidden">
                {/* Settings */}
                <button
                    onClick={() => handleNav("/settings")}
                    className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                        sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                    } ${
                        activeMenu === "Settings"
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <Settings className={`shrink-0 transition-all duration-200 ${activeMenu === "Settings" ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'}`} size={20} />
                    {!sidebarCollapsed && <span className="text-[14px] font-medium">Settings</span>}
                    {sidebarCollapsed && <span className="sidebar-tooltip">Settings</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 ${
                        sidebarCollapsed ? 'justify-center px-2' : 'px-4'
                    }`}
                >
                    <LogOut className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors" size={20} />
                    {!sidebarCollapsed && <span className="text-[14px] font-medium">Logout</span>}
                    {sidebarCollapsed && <span className="sidebar-tooltip">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default SideBar;