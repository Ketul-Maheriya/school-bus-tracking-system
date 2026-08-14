import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/api"

const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" })
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/register", form)


            alert("Registration Successful. Please login.");

            navigate("/");


        }
        catch (e) {
            console.log(e)
            console.log(e);
            console.log(e.response);
            console.log(e.response?.data);

            alert(e.response?.data?.message || "Something went wrong");
        
    }
}
return (
    <>
        <div className="container">
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <input type="text" name="name" placeholder="Username" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input type="text" placeholder="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="text" placeholder="Phone No." name="Phone No" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input type="password" placeholder="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <button type="submit">Register</button>
            </form>
        </div>
    </>
)
}

export default Register;