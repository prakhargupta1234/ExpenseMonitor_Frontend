import { useState, useEffect } from 'react';
import { Wallet, Info, ServerCog } from 'lucide-react';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndPoints';
import Modal from './modal'; // Reusing the existing modal component

const AppInitializer = ({ onComplete }) => {
    const [showSplash, setShowSplash] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // 1. Send the wake-up request immediately
        const wakeUpServer = async () => {
            try {
                console.log("[AppInitializer] Sending wake-up request to server...");
                // We don't await this because we just want to fire and forget it
                axiosConfig.get(API_ENDPOINTS.HEALTH).catch(e => console.warn("Wake-up ping pending...", e.message));
            } catch (error) {
                console.error("Wake up request failed", error);
            }
        };

        wakeUpServer();

        // 2. Manage the splash to popup transition
        const timer = setTimeout(() => {
            setShowSplash(false);
            setShowPopup(true);
        }, 2500); // Show splash for 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleAcknowledge = () => {
        setShowPopup(false);
        onComplete();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000 ${showSplash ? 'bg-emerald-950' : 'bg-transparent'}`}>
            
            {/* Custom Animations for Splash */}
            <style>{`
                @keyframes scaleUpFade {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slideUpFade {
                    0% { transform: translateY(40px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes expandWidth {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) rotate(45deg); }
                    50% { transform: translateY(20px) rotate(60deg); }
                }
                
                .animate-scale-up { animation: scaleUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slide-up-1 { animation: slideUpFade 0.8s ease-out 0.2s forwards; opacity: 0; }
                .animate-slide-up-2 { animation: slideUpFade 0.8s ease-out 0.4s forwards; opacity: 0; }
                .animate-slide-up-3 { animation: slideUpFade 0.8s ease-out 0.6s forwards; opacity: 0; }
                .animate-loader { animation: expandWidth 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                .animate-float-1 { animation: float1 6s ease-in-out infinite; }
                .animate-float-2 { animation: float2 8s ease-in-out infinite reverse; }
            `}</style>

            {/* SPLASH SCREEN */}
            {showSplash && (
                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                    {/* Decorative Flat Background Elements */}
                    <div className="absolute top-[15%] left-[10%] md:left-[20%] w-32 h-32 bg-emerald-600 rounded-full opacity-20 animate-float-1"></div>
                    <div className="absolute bottom-[20%] right-[10%] md:right-[15%] w-48 h-48 bg-green-500 opacity-10 animate-float-2"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Animated Icon Container */}
                        <div className="relative w-28 h-28 mb-8 animate-scale-up group cursor-default">
                            {/* Layered solid shapes for a 3D flat effect */}
                            <div className="absolute inset-0 bg-emerald-600 rounded-3xl transform rotate-6 opacity-60 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"></div>
                            <div className="absolute inset-0 bg-emerald-500 rounded-3xl transform -rotate-3 opacity-80 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"></div>
                            <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                <Wallet size={50} className="text-emerald-600" />
                            </div>
                        </div>

                        {/* Typography */}
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2 animate-slide-up-1">
                            SpendingsIQ
                        </h1>
                        <p className="text-emerald-200 font-bold tracking-widest uppercase text-xs md:text-sm mb-12 animate-slide-up-2">
                            Track Smart • Spend Better • Save More
                        </p>

                        {/* Loading Bar */}
                        <div className="w-64 h-1.5 bg-emerald-900 rounded-full overflow-hidden animate-slide-up-3">
                            <div className="h-full bg-emerald-400 rounded-full animate-loader"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* INFO POPUP */}
            <Modal
                isOpen={showPopup}
                hideCloseButton={true}
                title={
                    <div className="flex items-center gap-2 text-emerald-700">
                        <ServerCog size={24} />
                        <span>Server Startup Notice</span>
                    </div>
                }
            >
                <div className="p-4 text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Information</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        To keep this application free, our backend server is hosted on a resource-saving tier. 
                        <strong> If no one has visited recently, the server goes to sleep.</strong>
                        <br /><br />
                        We have just sent a signal to wake it up! However, it may take <strong>up to 5 minutes</strong> for the server to fully restart. Please be patient if your login or signup takes a little longer than usual.
                    </p>
                    
                    <button
                        onClick={handleAcknowledge}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md active:scale-95"
                    >
                        I Understand, Let's Go!
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AppInitializer;
