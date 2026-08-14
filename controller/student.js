const std = require("../model/students")
const user = require("../model/user")
const Bus = require("../model/bus")
const Route = require("../model/route")

const getstudent = async (req, res) => {

    try {

        const all = await std
            .find({})
            .populate("parent", "name email phone")
            .populate("bus", "busNumber")
            .populate("route", "routeName stops");

        return res.status(200).json(all);

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }
};

const addStudent = async (req, res) => {

    try {

        const { name, standard, parent, bus, route, pickupStop } = req.body

        const isExsist = await std.findOne({ name, parent })
        if (isExsist) return res.status(400).json({ message: "Already Registered. " })

        const parentExists = await user.findOne({
            _id: parent,
            role: "parents"
        });

        if (!parentExists) {
            return res.status(400).json({
                message: "Parent not found"
            });
        }


        const busExists = await Bus.findById(bus);

        if (!busExists) {
            return res.status(400).json({
                message: "Bus not found"
            });
        }

        const routeExists = await Route.findById(route);

        if (!routeExists) {
            return res.status(400).json({
                message: "Route not found"
            });
        }

        if (
            busExists.route &&
            busExists.route.toString() !== route
        ) {
            return res.status(400).json({
                message: "Selected bus is not assigned to this route"
            });
        }




        const newstd = await std.create({ name, standard, parent, bus, route, pickupStop });
        return res.status(200).json({ message: "Student Registered!" })

    } catch (e) {
        return res.status(400).json(e.message)
    }
}

const updateStudent = async (req, res) => {

    try {
        const updated = await std.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Student not Found" });
        return res.status(200).json({ message: "Student updated", updated });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}


const deleteStd = async (req, res) => {
    try {
        const isExist = await std.findById(req.params.id);
        if (!isExist) return res.status(404).json({ message: "Student not Found" });

        await std.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student removed' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};



const getMyStudents = async (req, res) => {
    try {
        const students = await std
            .find({ parent: req.user.id })
            .populate({
                path: "bus",
                select: "busNumber currentLocation status driver route",
                populate: {
                    path: "driver",
                    select: "name phone"
                }
            })
            .populate({
                path: "route",
                select: "routeName stops"
            });

        return res.status(200).json(students);

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

const getParents = async (req, res) => {

    try {

        const parents = await user.find(
            { role: "parents" },
            "name email phone"
        );

        return res.status(200).json(parents);

    } catch (e) {

        return res.status(500).json({
            message: e.message
        });

    }
};



module.exports = { getstudent, addStudent, updateStudent, deleteStd, getMyStudents,getParents }