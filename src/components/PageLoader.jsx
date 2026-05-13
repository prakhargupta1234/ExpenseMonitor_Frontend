const PageLoader = () => {
    return (
        <div className="flex flex-col justify-center items-center py-24">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse opacity-30"></div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4 font-medium">Loading...</p>
        </div>
    );
};

export default PageLoader;