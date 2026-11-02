import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut, Settings, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
        <div className={`h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden sidebar-transition w-full ${sidebarCollapsed ? 'w-[80px]' : 'w-[270px]'}`}>

            {/* ── Top: Header & User Profile ── */}
            <div className={`flex-shrink-0 px-3 pt-3.5 pb-3 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                {/* Collapse / Expand Toggle Bar - Desktop only */}
                <div className={`hidden lg:flex items-center mb-3 ${sidebarCollapsed ? 'justify-center w-full' : 'justify-between'}`}>
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-2 px-1">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Workspace
                            </span>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className={`flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 border border-transparent hover:border-gray-200/60 transition-all duration-200 cursor-pointer ${
                            sidebarCollapsed 
                                ? 'w-9 h-9 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100/80' 
                                : 'w-7 h-7'
                        }`}
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={17} />}
                    </button>
                </div>

                {/* Profile Card / Avatar */}
                {sidebarCollapsed ? (
                    <div className="relative group/avatar cursor-default flex justify-center py-1">
                        {user?.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt="profile"
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                            />
                        ) : (
                            <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-xs ring-2 ring-emerald-500/10">
                                <span className="text-white font-bold text-sm tracking-wide">{initials}</span>
                            </div>
                        )}
                        <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        <span className="sidebar-tooltip">{user?.name || user?.fullName || "User"}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100/80 hover:bg-gray-50 transition-all duration-200">
                        <div className="relative flex-shrink-0">
                            {user?.profileImageUrl ? (
                                <img
                                    src={user.profileImageUrl}
                                    alt="profile"
                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20 shadow-xs"
                                />
                            ) : (
                                <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-xs ring-2 ring-emerald-500/10">
                                    <span className="text-white font-bold text-sm tracking-wide">{initials}</span>
                                </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-snug tracking-tight">
                                {user?.name || user?.fullName || "User"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5 font-normal leading-tight">
                                {user?.email || "Personal Account"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Divider ── */}
            <div className="mx-3 h-px bg-gray-100 flex-shrink-0" />

            {/* ── Middle: Navigation ── */}
            <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {!sidebarCollapsed && (
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-2 pt-0.5">Menu</p>
                )}
                {SIDE_BAR_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            onClick={() => handleNav(item.path)}
                            key={`menu_${index}`}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`group relative w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                                sidebarCollapsed ? 'justify-center px-2' : 'px-3'
                            } ${
                                isActive
                                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20'
                                    : 'text-gray-600 hover:bg-gray-50/90 hover:text-gray-900 font-medium'
                            }`}
                        >
                            <item.icon
                                className={`shrink-0 transition-colors duration-200 ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'
                                }`}
                                size={19}
                            />
                            {!sidebarCollapsed && (
                                <span className="text-sm truncate">
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