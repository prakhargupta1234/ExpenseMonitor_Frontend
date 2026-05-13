import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { LoaderCircle, Wallet } from "lucide-react";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import ProfilePhotoSelector from "../components/profilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";

const Signup = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = null;
        setIsLoading(true);

        //basic validation
        if (!fullName.trim()) {
            setError("Please enter your full name");
            setIsLoading(false);
            return;
        }

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

        try {
            // upload the image if it is present
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })

            if (response.status === 201) {
                toast.success("Registration successful! Please Activate the account to continue.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Something went wrong");
            setError(error.message);
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
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white drop-shadow-md">ExpenseIQ</span>
            </div>

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-3xl font-bold text-black text-center mb-2">
                        Join ExpenseIQ Today
                    </h3>

                    <p className="text-sm text-slate-700 text-center mb-8 font-medium">
                        Track Smart • Spend Better • Save More
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        <Input
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                            }}
                            placeholder="Enter your full name"
                            type="text"
                        />
                        <Input
                            label="Email Address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            placeholder="Enter your email address"
                            type="text"
                        />
                        <Input
                            label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
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
                            {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-700 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;