import React, { useEffect, useState } from "react";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {

    const [form, setForm] = useState({
        name: "",
        standard: "",
        parent: "",
        bus: "",
        route: "",
        pickupStop: ""
    });

    const [parents, setParents] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [students, setStudents] = useState([]);

    const [id, setId] = useState(null);

    const navigate = useNavigate();


    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {

        try {

            const parentResponse = await api.get("/get-parents");
            const busResponse = await api.get("/get-bus");
            const routeResponse = await api.get("/get-route");
            const studentResponse = await api.get("/get-student");

            setParents(parentResponse.data);
            setBuses(busResponse.data);
            setRoutes(routeResponse.data);
            setStudents(studentResponse.data);

        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Unable to fetch data"
            );

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


    // =========================
    // FORM INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (id) {

                await api.put(
                    `/update-student/${id}`,
                    form
                );

                alert("Student updated successfully.");

                setId(null);

            } else {

                await api.post(
                    "/add-student",
                    form
                );

                alert("Student registered successfully.");

            }


            setForm({
                name: "",
                standard: "",
                parent: "",
                bus: "",
                route: "",
                pickupStop: ""
            });

            fetchData();

        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Something went wrong"
            );

        }

    };


    // =========================
    // EDIT
    // =========================

    const handleEdit = (student) => {

        setId(student._id);

        setForm({
            name: student.name || "",
            standard: student.standard || "",
            parent: student.parent?._id || student.parent || "",
            bus: student.bus?._id || student.bus || "",
            route: student.route?._id || student.route || "",
            pickupStop: student.pickupStop || ""
        });

    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (studentId) => {

        try {

            await api.delete(
                `/delete-student/${studentId}`
            );

            alert("Student deleted successfully.");

            fetchData();

        } catch (e) {

            alert(
                e.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // =========================
    // GET STOPS OF SELECTED ROUTE
    // =========================

    const selectedRoute = routes.find(
        (r) => r._id === form.route
    );

    const stops = selectedRoute?.stops || [];


    return (

        <>

            {/* =========================
                ADD STUDENT FORM
            ========================= */}

            <div
                className="container"
                style={{
                    gridColumn: "auto"
                }}
            >

                <h1>
                    {id ? "Update Student" : "Add Student"}
                </h1>


                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "15px"
                    }}
                >

                    {/* Student Name */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Student Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />


                    {/* Standard */}

                    <input
                        type="text"
                        name="standard"
                        placeholder="Standard"
                        value={form.standard}
                        onChange={handleChange}
                        required
                    />


                    {/* Parent */}

                    <select
                        name="parent"
                        value={form.parent}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Parent
                        </option>

                        {parents.map((parent) => (

                            <option
                                key={parent._id}
                                value={parent._id}
                            >
                                {parent.name} - {parent.email}
                            </option>

                        ))}

                    </select>


                    {/* Bus */}

                    <select
                        name="bus"
                        value={form.bus}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Bus
                        </option>

                        {buses.map((bus) => (

                            <option
                                key={bus._id}
                                value={bus._id}
                            >
                                {bus.busNumber}
                            </option>

                        ))}

                    </select>


                    {/* Route */}

                    <select
                        name="route"
                        value={form.route}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Route
                        </option>

                        {routes.map((route) => (

                            <option
                                key={route._id}
                                value={route._id}
                            >
                                {route.routeName}
                            </option>

                        ))}

                    </select>


                    {/* Pickup Stop */}

                    <select
                        name="pickupStop"
                        value={form.pickupStop}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Pickup Stop
                        </option>

                        {stops.map((stop, index) => (

                            <option
                                key={`${stop.name}-${index}`}
                                value={stop.name}
                            >
                                {stop.name}
                            </option>

                        ))}

                    </select>


                    <button type="submit">

                        {id
                            ? "Update Student"
                            : "Register Student"
                        }

                    </button>


                    {id && (

                        <button
                            type="button"
                            onClick={() => {

                                setId(null);

                                setForm({
                                    name: "",
                                    standard: "",
                                    parent: "",
                                    bus: "",
                                    route: "",
                                    pickupStop: ""
                                });

                            }}
                        >
                            Cancel
                        </button>

                    )}

                </form>

            </div>


            {/* =========================
                STUDENT TABLE
            ========================= */}

            <div
                className="hero"
                style={{
                    overflowX: "auto"
                }}
            >

                <h1>
                    Students
                </h1>


                <table style={{width:"100%"}}>

                    <thead
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white"
                        }}
                    >

                        <tr>

                            <th>Name</th>

                            <th>Standard</th>

                            <th>Parent</th>

                            <th>Bus</th>

                            <th>Route</th>

                            <th>Pickup Stop</th>

                            <th colSpan={2}>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {students.map((student) => (

                            <tr key={student._id}>

                                <td>
                                    {student.name}
                                </td>

                                <td>
                                    {student.standard}
                                </td>

                                <td>
                                    {student.parent?.name ||
                                        "Not available"}
                                </td>

                                <td>
                                    {student.bus?.busNumber ||
                                        "Not assigned"}
                                </td>

                                <td>
                                    {student.route?.routeName ||
                                        "Not assigned"}
                                </td>

                                <td>
                                    {student.pickupStop ||
                                        "N/A"}
                                </td>

                                <td>

                                    <button
                                        style={{
                                            backgroundColor: "#2196F3",
                                            color: "white"
                                        }}
                                        onClick={() =>
                                            handleEdit(student)
                                        }
                                    >
                                        Edit
                                    </button>

                                </td>

                                <td>

                                    <button
                                        style={{
                                            backgroundColor: "#f44336",
                                            color: "white"
                                        }}
                                        onClick={() =>
                                            handleDelete(
                                                student._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </>

    );

};

export default AddStudent;