import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        //basic validation
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        setError("");
        //login api call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            })

            const { token, user } = response.data;
            if (token) {
                // Store token and user info in localStorage or context
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");

            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {

                console.error("Something went wrong", error);
                setError(error.message);
            }


        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">

            <img
                src={bg}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover blur-md"
            />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Login to Your Account
                    </h3>

                    <p className="text-sm text-slate-700 text-center mb-8">
                        Please enter your details to access your account and start tracking your expenses.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            placeholder="Enter your email address"
                            type="text"
                        />
                        <Input
                            label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            placeholder="Enter your password"
                            type="password"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoaderCircle className="animate-spin" /> : "Login"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-700 mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-black font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;