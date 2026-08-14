const express = require('express');
const router = express.Router();
const {register,login} = require("../controller/user");
const  {protected} = require("../authentication/authMiddleware")
const role = require("../authentication/roleMiddleware")

const {addDriver,getDriver, updateDriver, deleteDriver,updateLocation,stopTracking} = require("../controller/driver")
const {addBus,getBus,updateBus,deleteBus,getBusLocation} = require("../controller/bus")
const {addRoute,getRoute,updateRoute,deleteRoute} = require("../controller/route")


const {getstudent,addStudent,updateStudent,deleteStd,getMyStudents,getParents} = require("../controller/student")


router.post("/register",register);
router.post("/login",login)

router.get("/admin",protected,role("admin"),(req,res)=>{
    res.send("admin")
})


router.post("/add-driver",protected,role("admin"),addDriver)
router.get("/get-driver",protected,role("admin"),getDriver)
router.put("/update-driver/:id",protected,role("admin"),updateDriver)
router.delete("/delete-driver/:id",protected,role("admin"),deleteDriver)


router.post(
    "/add-student",
    protected,
    role("admin"),
    addStudent
);

router.get(
    "/get-student",
    protected,
    role("admin"),
    getstudent
);

router.put(
    "/update-student/:id",
    protected,
    role("admin"),
    updateStudent
);

router.delete(
    "/delete-student/:id",
    protected,
    role("admin"),
    deleteStd
);
router.get(
    "/get-parents",
    protected,
    role("admin"),
    getParents
);


router.post("/add-bus",protected,role("admin"),addBus)
router.get("/get-bus",protected,role("admin"),getBus)
router.put("/update-bus/:id",protected,role("admin"),updateBus)
router.delete("/delete-bus/:id",protected,role("admin"),deleteBus)



router.post("/add-route",protected,role("admin"),addRoute)
router.get("/get-route",protected,role("admin"),getRoute)
router.put("/update-route/:id",protected,role("admin"),updateRoute)
router.delete("/delete-route/:id",protected,role("admin"),deleteRoute)




router.get("/driver",protected,role("driver"),(req,res)=>{
    res.send("driver")
})
router.post("/driver-location",protected,role("driver"),updateLocation)

router.post("/driver-stop-tracking",protected,role("driver"),stopTracking)


router.get("/parents",protected,role("parents"),(req,res)=>{
    res.send("parents")
})
router.get(
    "/my-students",
    protected,
    role("parents"),
    getMyStudents
);
router.get(
    "/bus-location/:id",
    protected,
    role("parents"),
    getBusLocation
);



module.exports = router;