import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { Link } from "react-router-dom";
import { ReceiptEuro } from "lucide-react";
import { validateEmail } from "../util/validation";
const Signup = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async(e)=>{
    e.preventDefault();

    //basic validation
    if(!fullName.trim()){
        setError("Please enter your full name");
        return;
    }


    if(!validateEmail(email)){
        setError("Please enter a valid email address");
        return;
    }

     if(!password.trim()){
        setError("Please enter your password");
        return;
    }

    console.log(fullName, email, password)

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

              <button 
                        className="w-full py-3 text-lg font-medium text-white bg-purple-900 rounded-lg shadow-md hover:bg-purple-700 active:scale-[0.98] transition-all duration-300 ease-in-out" 
                        type="submit"
                        >
                        SIGN UP
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