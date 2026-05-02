import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, value, onChange, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex flex-col mb-4">
            <label className="text-[13px] text-slate-800 mb-1">
                {label}
            </label>

            <div className="relative">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-transparent border border-gray-300 rounded-md py-2 px-3 pr-10
                               text-gray-700 leading-tight focus:outline-none 
                               focus:border-blue-500 transition-colors"
                />

                {type === "password" && (
                    <span
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        {showPassword ? (
                            <Eye
                                size={20}
                                className="text-purple-900"
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                className="text-slate-400"
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Input;