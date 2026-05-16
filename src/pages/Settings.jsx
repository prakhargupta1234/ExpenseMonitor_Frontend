import { useContext } from "react";
import { User, Mail, Shield, Palette, LogOut, Edit3 } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    useUser();
    const { user, clearUser, sidebarCollapsed, toggleSidebar } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <Dashboard activeMenu="Settings">
            <div>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Profile Information */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-scale-in flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest">Profile Information</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 rounded-lg text-xs font-bold transition-all border border-gray-100 hover:border-emerald-100">
                                <Edit3 size={14} /> Edit
                            </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group">
                                {user?.profileImageUrl ? (
                                    <img src={user.profileImageUrl} alt="profile" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl" />
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                                        <span className="text-white font-bold text-3xl">
                                            {(user?.name || user?.fullName || "U").charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
                            </div>
                            
                            <div className="flex-1 space-y-5 text-center sm:text-left w-full">
                                <div className="pb-4 border-b border-gray-50">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                                    <p className="text-lg font-bold text-gray-900 leading-tight">{user?.fullName || user?.name || "User Name"}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                                    <p className="text-sm font-medium text-gray-600">{user?.email || "user@example.com"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-scale-in flex flex-col h-full" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest mb-6">Account Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Username</p>
                                        <p className="text-sm font-bold text-gray-800">{user?.name || user?.fullName || "User"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                        <p className="text-sm font-bold text-gray-800 truncate max-w-[150px] sm:max-w-none">{user?.email || "—"}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">Verified</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Shield className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
                                        <p className="text-sm font-bold text-gray-800">Active and secure</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest mb-6">Preferences</h3>
                    <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <Palette size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Compact Sidebar</p>
                                <p className="text-xs text-gray-400">Collapse the sidebar to show icons only</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${sidebarCollapsed ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${sidebarCollapsed ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-3xl border border-red-50 shadow-sm p-6 sm:p-8 animate-scale-in mb-10" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-[12px] font-bold text-red-500 uppercase tracking-widest mb-6">Session</h3>
                    <div className="flex items-center justify-between p-5 bg-red-50/30 rounded-2xl border border-red-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                                <LogOut size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Logout</p>
                                <p className="text-xs text-gray-400">Sign out from your account securely</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-bold shadow-lg shadow-red-100 active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 text-center border-t border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-sm text-gray-400 font-medium">
                        &copy; 2026 <span className="text-gray-900 font-bold">SpendingsIQ</span>. All rights reserved.
                    </p>
                </footer>
            </div>
        </Dashboard>
    );
};

export default Settings;
