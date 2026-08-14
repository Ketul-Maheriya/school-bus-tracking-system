const bus = require("../model/bus")
const user = require("../model/user")

const addBus = async (req, res) => {

    try {

        const {
            busNumber,
            capacity,
            driver,
            route
        } = req.body;


        const existingBus = await bus.findOne({
            busNumber
        });

        if (existingBus) {
            return res.status(400).json({
                message: "This Bus Already registered."
            });
        }


        // Validate driver

        if (driver) {

            const driverExists = await user.findOne({
                _id: driver,
                role: "driver"
            });

            if (!driverExists) {

                return res.status(400).json({
                    message: "Driver not found"
                });

            }

        }


        // Validate route

        if (route) {

            const routeExists = await Route.findById(route);

            if (!routeExists) {

                return res.status(400).json({
                    message: "Route not found"
                });

            }

        }


        // Create bus

        const newBus = await bus.create({
            busNumber,
            capacity,
            driver: driver || null,
            route: route || null
        });


        // Assign bus to driver

        if (driver) {

            await user.findByIdAndUpdate(
                driver,
                {
                    assignedBus: newBus._id
                }
            );

        }


        return res.status(201).json({
            message: "Bus Registered Successfully!",
            newBus
        });

    } catch (e) {

        return res.status(400).json({
            message: e.message
        });

    }

};

const getBus = async (req, res) => {
    try {

        const allBus = await bus
            .find({})
            .populate({
                path: "driver",
                select: "name email phone licenseNumber"
            })
            .populate({
                path: "route",
                select: "routeName stops"
            });

        return res.status(200).json(allBus);

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }
};

const updateBus = async (req, res) => {
    try {
        const updatedBus = await bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) return res.status(404).json({ message: "Bus not Found" });
        return res.status(200).json({ message: "Bus updated", bus: updatedBus });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const deleteBus = async (req, res) => {
    try {
        const isExist = await bus.findById(req.params.id);
        if (!isExist) return res.status(404).json({ message: "Bus not Found" });

        await bus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bus removed' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};




const getBusLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const busData = await bus.findById(id)
            .select("busNumber currentLocation status driver route")
            .populate("driver", "name phone")
            .populate("route", "routeName");

        if (!busData) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        return res.status(200).json({
            bus: busData
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};



module.exports = { addBus, getBus, updateBus, deleteBus,getBusLocation }