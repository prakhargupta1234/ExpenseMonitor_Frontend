import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { Link } from "react-router-dom";
import { LoaderCircle, ReceiptEuro } from "lucide-react";
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
    //console.log(fullName, email, password)
    //signup api call

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
                <div className="flex justify-center mb-6">
                    {/* Profile image*/}
                    <ProfilePhotoSelector  image= {profilePhoto}
                    setImage= {setProfilePhoto}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <Input 
                            label="Full Name"
                            value={fullName}
                            onChange={(e) =>{
                                setFullName(e.target.value)
                            }}
                            placeholder="Enter your full name"
                            type="text"
                        />


                        <Input 
                            label="Email Address"
                            value={email}
                            onChange={(e) =>{
                                setEmail(e.target.value)
                            }}
                            placeholder="Enter your email address"
                            type="text"
                        />  


                       <div className="col-span-2">
                             <Input 
                                label="Password"
                                value={password}
                                onChange={(e) =>{
                                    setPassword(e.target.value)
                                }}
                                placeholder="Enter your password"
                                type="password"
                            />
                       </div>
                       
                </div>

                {error &&(
                    <p className="text-red-500.text-sm.mt-2 text-center bg-red-50 p-2 rounded">
                        {error}
                    </p>
                )}

              <button disabled={isLoading}
                        className= {`w-full py-3 text-lg font-medium text-white bg-purple-900 rounded-lg shadow-md hover:bg-purple-700 active:scale-[0.98] transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${isLoading? 
                            `opacity-70 cursor-not-allowed `:``
                        }`} 
                        type="submit"
                        >
                        {isLoading ? 
                        <>
                        <LoaderCircle className="animate-spin w-5 h-5"/>
                        Signing Up...
                        </>
                        : ("SIGN UP")}
                </button>

                <p className="text-sm text-slate-800 text-center mt-6">
                    Already have an account?
                    <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark transition-colors">Login</Link>
                </p>
            </form>
        </div>
    </div>

    </div>

)};

export default Signup;