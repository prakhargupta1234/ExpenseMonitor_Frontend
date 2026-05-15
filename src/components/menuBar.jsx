import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Bell, Settings, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useContext, useState, useRef, useEffect } from "react";
import SideBar from "./sideBar";

const MenuBar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const getInitials = () => {
        const name = user?.name || user?.fullName || "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <>
            <div className="flex items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 px-4 sm:px-6 sticky top-0 z-30">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                        className="block lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                    >
                        {openSideMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img src={logo} alt="SpendingsIQ" className="h-9 w-9" />
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-gray-900 tracking-tight">Spendings</span>
                            <span className="text-lg font-bold text-emerald-600 tracking-tight">IQ</span>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Notification Bell */}
                    {/* <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                    </button> */}

                    {/* User Avatar Dropdown */}
                    <div className="relative" ref={dropDownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none"
                        >
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt="profile" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{getInitials()}</span>
                                </div>
                            )}
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-semibold text-gray-800 leading-none">{user?.name || user?.fullName || "User"}</p>
                                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Personal</p>
                            </div>
                            <ChevronDown size={14} className={`hidden sm:block text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in">
                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        {user?.profileImageUrl ? (
                                            <img src={user.profileImageUrl} alt="profile" className="w-11 h-11 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">{getInitials()}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {user?.fullName || user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {user?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="px-4 py-3 border-b border-gray-50 space-y-2">
                                    {user?.email && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Email</span>
                                            <span className="text-xs text-gray-600 font-medium truncate ml-2">{user.email}</span>
                                        </div>
                                    )}
                                    {(user?.name || user?.fullName) && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Name</span>
                                            <span className="text-xs text-gray-600 font-medium">{user.name || user.fullName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Status</span>
                                        <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Active</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="py-1.5 px-2">
                                    <button
                                        onClick={() => { navigate("/settings"); setShowDropdown(false); }}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                    >
                                        <Settings className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">Settings</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    >
                                        <LogOut className="w-4 h-4 text-red-500" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile side menu with overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${openSideMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setOpenSideMenu(false)}
            />
            <div
                className={`fixed inset-y-0 left-0 w-72 bg-white z-[110] lg:hidden transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="h-8 w-8" />
                        <div>
                            <span className="text-base font-bold text-gray-900">Spendings</span>
                            <span className="text-base font-bold text-emerald-600">IQ</span>
                        </div>
                    </div>
                    <button onClick={() => setOpenSideMenu(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
                <div className="h-full overflow-y-auto pb-20">
                    <SideBar activeMenu={activeMenu} onMenuItemClick={() => setOpenSideMenu(false)} />
                </div>
            </div>
        </>
    );
};

export default MenuBar;