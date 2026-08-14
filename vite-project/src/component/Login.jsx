import React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../axios/api.js";

const Login = () => {

    const [form,setForm] = useState({"email":"","password":""})
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try{

            const response = await api.post("/login",form);
            localStorage.setItem("token",response.data.token);

            if(response.data.user.role === "admin"){
                navigate("/admin");
            }else if(response.data.user.role === "driver"){
                navigate("/driver");
            }else{

                navigate("/parents");
            }
        }catch(err){
            console.log(err);
            alert("Invalid email or password");
        }
        // console.log(response.data);
    }

    return(
        <>

        <div className="container">

            <h1>Login</h1>
            <form onSubmit={handleLogin} >
                <input type="text" placeholder="email" name="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
                <input type="password" placeholder="password" name="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
                <button type="submit">Login</button>
            </form>
        </div>

        </>
    )
}

export default Login;