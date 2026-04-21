import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bgcimage.png";
import Input from "../components/input";
import { Link } from "react-router-dom";

const Login =()=>{

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

            <form className="space-y-4">
                        <Input 
                            label="Email Address"
                            value={email}
                            onChange={(e) =>{
                                setEmail(e.target.value)
                            }}
                            placeholder="Enter your email address"
                            type="text"
                        />  

                             <Input 
                                label="Password"
                                value={password}
                                onChange={(e) =>{
                                    setPassword(e.target.value)
                                }}
                                placeholder="Enter your password"
                                type="password"
                            />


                {error &&(
                    <p className="text-red-500.text-sm.mt-2 text-center bg-red-50 p-2 rounded">
                        {error}
                    </p>
                )}

              <button 
                        className="w-full py-3 text-lg font-medium text-white bg-purple-900 rounded-lg shadow-md hover:bg-purple-700 active:scale-[0.98] transition-all duration-300 ease-in-out" 
                        type="submit"
                        >
                        LOGIN
                </button>

                <p className="text-sm text-slate-800 text-center mt-6">
                    Don't have an account?
                    <Link to="/signup" className="font-medium text-primary underline hover:text-primary-dark transition-colors">Signup</Link>
                </p>
            </form>
        </div>
    </div>

    </div>
    )
};

export default Login;