import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import ProfilePhotoSelector from "../components/profilePhotoSelector";
import  uploadProfileImage  from "../util/uploadProfileImage";  

const Signup = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading]= useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();


  const handleSubmit = async(e)=>{
    e.preventDefault();
    let profileImageUrl = null;
    setIsLoading(true);

    //basic validation
    if(!fullName.trim()){
        setError("Please enter your full name");
        setIsLoading(false);
        return;
    }


    if(!validateEmail(email)){
        setError("Please enter a valid email address");
         setIsLoading(false);
        return;
    }

     if(!password.trim()){
        setError("Please enter your password");
         setIsLoading(false);
        return;
    }

    setError("");

    try{

        // upload the image if it is present
        if(profilePhoto){
            const imageUrl= await uploadProfileImage(profilePhoto);
            profileImageUrl= imageUrl||"";
        } 
        const response=await axiosConfig.post(API_ENDPOINTS.REGISTER,{
            fullName,
            email,
            password,
            profileImageUrl
        })

        if(response.status === 201){
            toast.success("Registration successful Completed! Please Activate the account to continue.");
            navigate("/login");
        }
    }catch(error){
        console.error("Something went wrong");
        setError(error.message);
    }finally{
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
            Create an Account
            </h3>

            <p className="text-sm text-slate-700 text-center mb-8">
            Start tracking your spending by joining us.
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
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-700 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-semibold hover:underline">
                Login
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;