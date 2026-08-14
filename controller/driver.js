const user = require("../model/user")
const bus = require("../model/bus")
const Location = require("../model/location");
const bcrypt = require("bcryptjs")

const addDriver = async (req,res) =>{

    try{

        const { name, email, phone, password, licenseNumber, assignedBus } = req.body;

        const isExsist = await user.findOne({email})
        if(isExsist) return res.status(400).json({message:"Driver is Already registered."})


        const hash = await bcrypt.hash(password,10)

        const newDriver = await user.create({
            name,
            email,
            phone,
            password: hash,
            licenseNumber,
            assignedBus,
            role: "driver"
        })
        
        res.status(201).json({ message: "Driver registered successfully", newDriver });
 
    }catch(e){
        return res.status(400).json({message:e.message})
    }
}



const getDriver = async (req,res) =>{

    const allDriver = await user.find({role:"driver"})

    return res.status(200).json(allDriver)

}


const updateDriver = async (req, res) => {
    try {
        const updated = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Driver not Found" });
        return res.status(200).json({ message: "Driver updated",  updated });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const isExist = await user.findById(req.params.id);
        if (!isExist) return res.status(404).json({ message: "Driver not Found" });

        await user.findByIdAndDelete(req.params.id);
        res.json({ message: 'Driver removed' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};



const updateLocation = async (req,res) =>{

    try{

        const { lat, lng, speed, heading } = req.body;

        if(lat === undefined || lng === undefined){
            return res.status(400).json({message:"Latitude and Longitude are required"})
        }

        const driver = await user.findById(req.user.id);
        if(!driver) return res.status(404).json({message:"Driver not found"})
        
        if(!driver.assignedBus) return res.status(400).json({message:"No bus assigned to this driver"})
        
        const assignedBus = await bus.findById(driver.assignedBus);
        if(!assignedBus) return res.status(404).json({message:"Assigned bus not found"})

        assignedBus.currentLocation = { 
            lat :lat,
            lng:lng,
            speed:speed || 0,
            heading:heading || 0,
            updatedAt:new Date()
        };
        assignedBus.status = "active"
        
        await assignedBus.save();

        await Location.create({ 
            bus: assignedBus._id,
            lat: lat,
            lng: lng,
            speed: speed || 0,
            heading: heading || 0
        });


        return res.status(200).json({ message: "Location updated", currentLocation: assignedBus.currentLocation });

    }catch(e){
        return res.status(400).json({message:e.message})
    }


    
}


const stopTracking = async (req, res) => {

    try {

        const driver = await user.findById(req.user.id);

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        if (!driver.assignedBus) {
            return res.status(400).json({
                message: "No bus assigned"
            });
        }

        const assignedBus = await bus.findById(driver.assignedBus);

        if (!assignedBus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        assignedBus.status = "inactive";

        await assignedBus.save();

        return res.status(200).json({
            message: "Tracking stopped",
            status: assignedBus.status
        });

    } catch (e) {

        return res.status(400).json({
            message: e.message
        });

    }
};


module.exports = {addDriver,getDriver,updateDriver,deleteDriver,updateLocation,stopTracking}