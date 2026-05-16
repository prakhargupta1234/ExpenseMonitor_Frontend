import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/Input";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { LoaderCircle, Wallet } from "lucide-react";
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

            {/* Top Left Logo and Project Name */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet size={18} className="text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">ExpenseIQ</span>
            </div>

            <div className="relative z-10 w-full max-w-lg px-4 sm:px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl sm:text-3xl font-bold text-black text-center mb-2">
                        Welcome Back to ExpenseIQ
                    </h3>

                    <p className="text-sm text-slate-700 text-center mb-8 font-medium">
                        Track Smart • Spend Better • Save More
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
                            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center shadow-md shadow-emerald-200"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoaderCircle className="animate-spin" /> : "Login"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-700 mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;