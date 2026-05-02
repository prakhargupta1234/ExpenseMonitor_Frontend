import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import { useContext, useState, useRef, useEffect } from "react";
import SideBar from "./sideBar";


const MenuBar = ({activeMenu}) => {
    const[openSideMenu, setOpenSideMenu] = useState(false);
    const[showDropdown, setShowDropdown] = useState(false);
    const dropDownRef= useRef(null);
    const {user, clearUser}= useContext(AppContext);
    const navigate = useNavigate();
    

    const handleLogout=()=>{
        localStorage.clear();
        clearUser();
        setShowDropdown(false);
        navigate("/login");

    }

    useEffect(()=>{
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }

        }
        if(showDropdown){
            document.addEventListener("mousedown", handleClickOutside);

        }
        return()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[showDropdown])
    
    return(
        
        <div className="flex items-center justify-between gap-5  bg-white 
        border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 
        sm:px-7 sticky top-0 z-30 ">
        {/* Left side - Menu button and title*/}
        <div className="flex items-center gap-5">
            <button
                onClick={() => setOpenSideMenu(!openSideMenu)}
                className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
            >
                {openSideMenu ? (
                <X className="text-2xl" />
                ) : (
                <Menu className="text-2xl" />
                )}
            </button>

        <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-10 w-10" />
            <span className="text-lg font-medium text-black truncate">
                Money Manager
            </span>
        </div>
        </div>
        {/* Right side - Avatar photo */}
        <div className="relative" ref={dropDownRef}>
        <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2">
            {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <User className="text-purple-500" />
            )}
        </button>

        {/* DropDown Menu */}
        {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border-gray-200  py-1 z-50">

                {/* user info */}

                <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className=" flex items-center justify-center 
                         w-8 h-8 bg-gray-100 rounded-full">
                            <User className="w-4 h-4 text-purple-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.fullName || user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* drop down options */}
                <div className="py-1">
                <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                    <LogOut className="w-4 h-4 text-gray-500"/>
                    <span>Logout</span>
                </button>
                
                </div> 
            </div>
        )}
        </div>
            {/* Mobile side menu */}
            {openSideMenu && (
            <div className="fixed inset-x-0 bottom-0 top-[73px] bg-white lg:hidden z-40 overflow-hidden">
                <SideBar activeMenu={activeMenu} onMenuItemClick={() => setOpenSideMenu(false)} />
            </div>
            )}
        </div>

    )
}

export default MenuBar;