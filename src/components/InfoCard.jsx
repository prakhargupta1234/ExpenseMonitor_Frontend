const InfoCard = ({icon, label, value, color}) => {
    return (
        <div className="group flex items-center gap-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50/50 transition-all duration-500 h-full relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${color}`} />
            
            {icon && (
                <div className={`w-14 h-14 shrink-0 flex items-center justify-center text-[26px] text-white ${color} rounded-2xl shadow-lg shadow-gray-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {icon}
                </div>
            )}
            
            <div className="flex-1 min-w-0 relative z-10">
                <h6 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-1 truncate">
                    {label}
                </h6>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;