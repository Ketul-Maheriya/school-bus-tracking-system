const user = require("../model/user")
const bus = require("../model/bus")
const Route = require("../model/route")
const bcrypt = require("bcryptjs")


const createDriver = async (req, res) => {

    try {
        const { name, email, phone, password, licenseNumber, assignedBus } = req.body;

        const isExisits = await user.findOne({ email });
        if (isExisits) return res.status(400).json({ message: "Already Register" });

        const hash = await bcrypt.hash(password, 10);

        const driver = await user.create({
            name,
            email,
            phone,
            password: hash,
            licenseNumber,
            assignedBus,
            role: "driver"
        })

        res.status(201).json({ message: "Driver registered successfully", driver });
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}


const addBus = async (req, res) => {

    try {

        const { busNumber, capacity, driver, route } = req.body;

        const isExisits = await bus.findOne({ busNumber });
        if (isExisits) return res.status(400).json({ message: "Already Register" });

        if (driver) {
            const driverExists = await user.findOne({ _id: driver, role: "driver" });
            if (!driverExists) return res.status(400).json({ message: "Driver not found" });
        }

        if (route) {
            const routeExists = await Route.findById(route);
            if (!routeExists) return res.status(400).json({ message: "Route not found" });
        }


        const newBus = await bus.create({ busNumber, capacity, driver, route })

        if (driver) {
            await user.findByIdAndUpdate(driver, { assignedBus: newBus._id });
        }

        res.status(201).json({ message: "Bus added successfully", newBus });

    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}



const addRoute = async (req, res) => {
    try {
        const { routeName, stops } = req.body;

        if (!routeName || !stops || !Array.isArray(stops) || stops.length === 0) {
            return res.status(400).json({ message: "Invalid route data" });
        }

        const existingRoute = await Route.findOne({ routeName });

        if (existingRoute) {
            return res.status(400).json({
                message: "Route already exists"
            });
        }

        const newRoute = await Route.create({ routeName, stops });
        res.status(201).json({ message: "Route added successfully", newRoute });
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}
module.exports = { createDriver, addBus, addRoute }