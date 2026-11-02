import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut, Settings, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import logo from "../assets/logo.png";
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
        <div className={`h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden sidebar-transition w-full ${sidebarCollapsed ? 'w-[70px]' : 'w-[250px]'}`}>

            {/* ── Top: Interactive Brand & Collapse Toggle ── */}
            <div className={`flex-shrink-0 border-b border-gray-100/90 ${
                sidebarCollapsed ? 'py-2.5 px-2 flex flex-col items-center gap-2' : 'px-3 py-2.5'
            }`}>
                {sidebarCollapsed ? (
                    <>
                        {/* Collapsed Logo (Interactive) */}
                        <div
                            onClick={() => handleNav("/dashboard")}
                            className="group/brand relative cursor-pointer p-1 rounded-xl hover:bg-emerald-50/70 transition-all duration-200"
                            title="ExpenseIQ - Dashboard"
                        >
                            <img
                                src={logo}
                                alt="ExpenseIQ"
                                className="h-8 w-8 object-contain transform transition-transform duration-300 group-hover/brand:scale-110"
                            />
                            <span className="absolute top-0 right-0 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="sidebar-tooltip">ExpenseIQ</span>
                        </div>

                        {/* Collapsed Expand Toggle */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-100/80 transition-all duration-200 cursor-pointer shadow-xs"
                            title="Expand sidebar"
                            aria-label="Expand sidebar"
                        >
                            <PanelLeftOpen size={16} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-between gap-1.5">
                        {/* Interactive Logo & Brand */}
                        <div
                            onClick={() => handleNav("/dashboard")}
                            className="group/brand flex items-center gap-2 cursor-pointer py-1 px-1.5 -ml-1 rounded-xl hover:bg-emerald-50/70 transition-all duration-200 select-none flex-1 min-w-0"
                            title="ExpenseIQ - Go to Dashboard"
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={logo}
                                    alt="ExpenseIQ"
                                    className="h-8 w-8 object-contain transform transition-transform duration-300 group-hover/brand:scale-105 group-hover/brand:rotate-[-2deg]"
                                />
                                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-base font-bold text-gray-900 tracking-tight leading-none group-hover/brand:text-emerald-950 transition-colors">
                                        Expense<span className="text-emerald-600 font-extrabold">IQ</span>
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100/80 text-emerald-700 tracking-wide uppercase">
                                        PRO
                                    </span>
                                </div>
                                <span className="text-[9.5px] text-gray-400 font-medium truncate mt-0.5 tracking-wider uppercase">
                                    Finance Hub
                                </span>
                            </div>
                        </div>

                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200/60 transition-all duration-200 cursor-pointer flex-shrink-0"
                            title="Collapse sidebar"
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftClose size={17} />
                        </button>

                        {/* Mobile Drawer Close Button */}
                        {onMenuItemClick && (
                            <button
                                onClick={onMenuItemClick}
                                className="block lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                title="Close menu"
                            >
                                <X size={17} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Middle: Navigation ── */}
            <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden no-scrollbar">
                {!sidebarCollapsed && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2.5 pt-1 pb-1">Menu</p>
                )}
                {SIDE_BAR_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            onClick={() => handleNav(item.path)}
                            key={`menu_${index}`}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`group relative w-full flex items-center gap-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                                sidebarCollapsed ? 'justify-center px-2' : 'px-2.5'
                            } ${
                                isActive
                                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                                    : 'text-gray-600 hover:bg-gray-50/90 hover:text-gray-900 font-medium'
                            }`}
                        >
                            <item.icon
                                className={`shrink-0 transition-colors duration-200 ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                                }`}
                                size={18}
                            />
                            {!sidebarCollapsed && (
                                <span className="text-[13.5px] truncate">
                                    {item.label}
                                </span>
                            )}
                            {isActive && !sidebarCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
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
            <div className="mx-2.5 h-px bg-gray-100/90 flex-shrink-0" />

            {/* ── Bottom: User Profile & Actions ── */}
            <div className={`flex-shrink-0 px-2 py-2 space-y-1.5 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                {/* Profile Card / Avatar */}
                {sidebarCollapsed ? (
                    <div className="relative group/avatar cursor-default flex justify-center py-0.5">
                        {user?.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt="profile"
                                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20 shadow-xs"
                            />
                        ) : (
                            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-xs ring-2 ring-emerald-500/10">
                                <span className="text-white font-bold text-xs tracking-wide">{initials}</span>
                            </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        <span className="sidebar-tooltip">{user?.name || user?.fullName || "User"}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5 p-1.5 px-2 rounded-xl bg-gray-50/80 border border-gray-100/80 hover:bg-gray-50 transition-all duration-200">
                        <div className="relative flex-shrink-0">
                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt="profile"
                                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20 shadow-xs"
                                />
                            ) : (
                                <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-xs ring-2 ring-emerald-500/10">
                                    <span className="text-white font-bold text-xs tracking-wide">{initials}</span>
                                </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 truncate leading-tight tracking-tight">
                                {user?.name || user?.fullName || "User"}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5 font-normal leading-tight">
                                {user?.email || "Personal Account"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Settings + Logout */}
                <div className="space-y-0.5 w-full">
                    <button
                        onClick={() => handleNav("/settings")}
                        title={sidebarCollapsed ? "Settings" : undefined}
                        className={`group relative w-full flex items-center gap-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                            sidebarCollapsed ? 'justify-center px-2' : 'px-2.5'
                        } ${
                            isSettingsActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Settings
                            className={`shrink-0 transition-colors duration-200 ${
                                isSettingsActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                            }`}
                            size={17}
                        />
                        {!sidebarCollapsed && <span className="text-xs font-medium">Settings</span>}
                        {sidebarCollapsed && <span className="sidebar-tooltip">Settings</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        title={sidebarCollapsed ? "Logout" : undefined}
                        className={`group relative w-full flex items-center gap-2.5 py-1.5 rounded-xl transition-all duration-200 text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer ${
                            sidebarCollapsed ? 'justify-center px-2' : 'px-2.5'
                        }`}
                    >
                        <LogOut className="shrink-0 text-gray-400 group-hover:text-red-500 transition-colors duration-200" size={17} />
                        {!sidebarCollapsed && <span className="text-xs font-medium">Logout</span>}
                        {sidebarCollapsed && <span className="sidebar-tooltip">Logout</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideBar;