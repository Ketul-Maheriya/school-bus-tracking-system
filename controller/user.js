const user = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    try {
        const { name, email, phone, password, role } = req.body;

        const userExists = await user.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User is already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUSer = await user.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "parents"
        });

        res.status(201).json({ message: "User registered successfully", newUSer });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `That ${field} is already in use. Please try another standard unique value.`
            });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}


const login = async (req, res) => {



    try {
        const { email, password } = req.body;

        const userExisting = await user.findOne({ email });
        if (!userExisting) {
            return res.status(400).json({ message: "User is not found" });
        }

        const isMatch = await bcrypt.compare(password, userExisting.password);
        if (isMatch) {

            const token = await jwt.sign({ id: userExisting._id, role: userExisting.role }, process.env.jwt, { expiresIn: "1d" });
            res.status(200).json({
                message: "Login Succesfully!", token,
                user: {
                    id: userExisting._id,
                    name: userExisting.name,
                    email: userExisting.email,
                    role: userExisting.role
                }
            })

        } else {

            return res.status(400).json({ message: "Invalid Password" });
        }



    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { register, login };