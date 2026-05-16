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

    const initials = (user?.name || user?.fullName || "U").charAt(0).toUpperCase();
    const isSettingsActive = activeMenu === "Settings";

    return (
        <div className={`h-full bg-white border-r border-gray-100/80 flex flex-col overflow-hidden sidebar-transition ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>

            {/* ── Top: User Profile ── */}
            <div className={`flex-shrink-0 px-3 pt-4 pb-3 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                {/* Collapse Toggle - Desktop only */}
                <div className={`hidden lg:flex mb-3 ${sidebarCollapsed ? 'justify-center' : 'justify-end'}`}>
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Profile Card */}
                <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 ${sidebarCollapsed ? 'justify-center p-2' : ''}`}>
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt="profile"
                            className={`rounded-xl object-cover border-2 border-emerald-100 shadow-sm flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}
                        />
                    ) : (
                        <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">{initials}</span>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                                {user?.name || user?.fullName || "User"}
                            </p>
                            <p className="text-[11px] text-emerald-600 font-medium truncate mt-0.5">
                                {user?.email || "Personal Account"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="mx-3 h-px bg-gray-100 flex-shrink-0" />

            {/* ── Middle: Navigation ── */}
            <nav className={`flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden ${sidebarCollapsed ? 'no-scrollbar' : ''}`}>
                {!sidebarCollapsed && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-2">Menu</p>
                )}
                {SIDE_BAR_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            onClick={() => handleNav(item.path)}
                            key={`menu_${index}`}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                                sidebarCollapsed ? 'justify-center px-2' : 'px-3'
                            } ${
                                isActive
                                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <item.icon
                                className={`shrink-0 transition-colors duration-200 ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                                }`}
                                size={19}
                            />
                            {!sidebarCollapsed && (
                                <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                            {isActive && !sidebarCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                            )}
                            {/* Collapsed tooltip */}
                            {sidebarCollapsed && (
                                <span className="sidebar-tooltip">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* ── Divider ── */}
            <div className="mx-3 h-px bg-gray-100 flex-shrink-0" />

            {/* ── Bottom: Settings + Logout ── */}
            <div className="flex-shrink-0 px-2 py-3 space-y-0.5">
                <button
                    onClick={() => handleNav("/settings")}
                    title={sidebarCollapsed ? "Settings" : undefined}
                    className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                        sidebarCollapsed ? 'justify-center px-2' : 'px-3'
                    } ${
                        isSettingsActive
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    <Settings
                        className={`shrink-0 transition-colors duration-200 ${
                            isSettingsActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                        }`}
                        size={19}
                    />
                    {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
                    {sidebarCollapsed && <span className="sidebar-tooltip">Settings</span>}
                </button>

                <button
                    onClick={handleLogout}
                    title={sidebarCollapsed ? "Logout" : undefined}
                    className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 ${
                        sidebarCollapsed ? 'justify-center px-2' : 'px-3'
                    }`}
                >
                    <LogOut className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors duration-200" size={19} />
                    {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
                    {sidebarCollapsed && <span className="sidebar-tooltip">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default SideBar;