import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";

export const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.log("Failed to fetch the user info", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, setUser, clearUser, navigate]);

  return { user, isLoading };
}

export default useUser;