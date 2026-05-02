import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("Invalid activation link. Token is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosConfig.get(`${API_ENDPOINTS.ACTIVATE}?token=${token}`);
        if (response.status === 200) {
          setMessage(response.data);
          toast.success(response.data);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err) {
        setError(err.response?.data || "Failed to activate account. Please try again.");
        toast.error(err.response?.data || "Failed to activate account.");
      } finally {
        setIsLoading(false);
      }
    };

    activateAccount();
  }, [searchParams, navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LoaderCircle className="animate-spin h-12 w-12 text-black" />
            <p className="mt-4 text-lg">{message}</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : (
          <p className="text-green-500 text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Activate;
