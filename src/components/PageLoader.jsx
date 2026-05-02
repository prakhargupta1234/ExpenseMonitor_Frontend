import { LoaderCircle } from "lucide-react";

const PageLoader = () => {
    return (
        <div className="flex justify-center items-center py-20">
            <LoaderCircle className="animate-spin h-10 w-10 text-gray-400" />
        </div>
    );
};

export default PageLoader;