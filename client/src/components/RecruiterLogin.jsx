import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState(false);
  const [iseNextDataSubmitted, setIseNextDataSubmitted] = useState(false);
  const {setShowRecruiterLogin,backendUrl,setCompanyData,setCompanyToken } = useContext(AppContext)
  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    if(state === "SignUp" && !iseNextDataSubmitted){
     return setIseNextDataSubmitted(true)
    }
    try {
      if(state === "Login"){
        const {data} = await axios.post(backendUrl + "/api/company/login",{email,password})
        if(data.success){
          
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem("companyToken",data.token)
          setShowRecruiterLogin(false)
          navigate("/dashboard");
        }
        else{
          toast.error(data.message)
        }

      }
      else{
        const formData = new  FormData();
        formData.append("name",name);
        formData.append("email",email);
        formData.append("password",password);
        formData.append("image",image);

        const {data} = await axios.post(backendUrl + "/api/company/register",formData);
        if(data.success){
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem("companyToken",data.token)
          setShowRecruiterLogin(false)
          navigate("/dashboard");
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }

  }
  useEffect(()=>{
    document.body.style.overflow = "hidden"
    return ()=>{
      document.body.style.overflow = "unset"
    }
  },[])

  return (
    <div className="absolute  top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={onSubmitHandler} className=" relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">
          Welcome back! Please enter your details to login.
        </p> 
        {
          state === "SignUp" && iseNextDataSubmitted ? <>
          <div className="flex items-center gap-4 m-5">
            <label htmlFor="image">
              <img className="w-16 rounded-full" src={image? URL.createObjectURL(image) : assets.upload_area} alt="" />
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" hidden id="image" />
            </label>
            <p>Upload Company <br /> Logo</p>
          </div>
          </> : 
        <>
          {state !== "Login" && (
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.person_icon} alt="" />
              <input
                className="outline-none text-sm"
                type="text"
                placeholder="Company Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}
          <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.email_icon} alt="" />
            <input
              className="outline-none text-sm"
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.lock_icon} alt="" />
            <input
              className="outline-none text-sm"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        
        </>
        }
         {state === "Login" && <p className="text-sm text-blue-600 mt-4 cursor-pointer">
          Forgot password?
        </p>
         
         } 
        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === "Login" ? "Login" : iseNextDataSubmitted ? "Create Account" : "next"}
        </button>
        {
          state === "Login" ? 
          <p className="mt-5 text-center">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={()=>setState("SignUp")}>Sign up</span></p> :
        <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={()=>setState("Login")}>Login</span></p>
        }
        <img onClick={(e)=>setShowRecruiterLogin(false)} src={assets.cross_icon} className=" absolute top-5 right-5 cursor-pointer" alt="" />
      </form>
    </div>
  );
};

export default RecruiterLogin;
