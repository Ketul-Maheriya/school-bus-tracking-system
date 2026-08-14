const route = require("../model/route")

const addRoute = async (req,res) =>{

    try{

        const {routeName,stops} = req.body;

        if(!routeName || !stops || !Array.isArray(stops)){
            return res.status(400).json({ message: "Invalid route data" });
        }

        const isexsist = await route.findOne({routeName});

        if(isexsist){
            return res.status(400).json({message:"This is Route is already exsist."})
        }

        const newRoute = await route.create({routeName,stops})

        return res.status(200).json({message:"Route added successfully!"})

    }catch(e){
        return res.status(400).json({message:e.message})
    }
}


const getRoute = async (req,res) =>{

    const allroutes = await route.find({})

    return res.status(200).json(allroutes)
}

const updateRoute = async (req, res) => {
    try {
        const updated = await route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Route not Found" });
        return res.status(200).json({ message: "Route updated",  updated });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

const deleteRoute = async (req, res) => {
    try {
        const isExist = await route.findById(req.params.id);
        if (!isExist) return res.status(404).json({ message: "Route not Found" });

        await route.findByIdAndDelete(req.params.id);
        res.json({ message: 'Route removed' });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

module.exports = {addRoute,getRoute,updateRoute,deleteRoute}