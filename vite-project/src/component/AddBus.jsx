import React, { useEffect, useState } from "react";
import api from "../axios/api";

const AddBus = () => {

    const [form, setForm] = useState({
        busNumber: "",
        capacity: "",
        driver: "",
        route: ""
    });

    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [id, setId] = useState(null);


    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {

        try {

            const busResponse = await api.get("/get-bus");
            setBuses(busResponse.data);

            const driverResponse = await api.get("/get-driver");
            setDrivers(driverResponse.data);

            const routeResponse = await api.get("/get-route");
            setRoutes(routeResponse.data);

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
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    // =========================
    // ADD / UPDATE BUS
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (id) {

                await api.put(
                    `/update-bus/${id}`,
                    form
                );

                alert("Bus updated successfully.");

            } else {

                await api.post(
                    "/add-bus",
                    form
                );

                alert("Bus added successfully.");

            }


            // Reset form

            setForm({
                busNumber: "",
                capacity: "",
                driver: "",
                route: ""
            });

            setId(null);

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

    const handleEdit = (bus) => {

        setId(bus._id);

        setForm({
            busNumber: bus.busNumber || "",
            capacity: bus.capacity || "",
            driver: bus.driver?._id || bus.driver || "",
            route: bus.route?._id || bus.route || ""
        });

    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (busId) => {

        try {

            await api.delete(
                `/delete-bus/${busId}`
            );

            alert("Bus deleted successfully.");

            fetchData();

        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        setId(null);

        setForm({
            busNumber: "",
            capacity: "",
            driver: "",
            route: ""
        });

    };


    return (

        <>

            {/* ================= FORM ================= */}

            <div
                className="container"
                style={{
                    gridColumn: "auto"
                }}
            >

                <h1>
                    {id ? "Update Bus" : "Add Bus"}
                </h1>


                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "15px"
                    }}
                >

                    {/* Bus Number */}

                    <input
                        type="text"
                        name="busNumber"
                        placeholder="Bus Number"
                        value={form.busNumber}
                        onChange={handleChange}
                        required
                    />


                    {/* Capacity */}

                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={form.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />


                    {/* Driver */}

                    <select
                        name="driver"
                        value={form.driver}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Driver
                        </option>

                        {drivers.map((driver) => (

                            <option
                                key={driver._id}
                                value={driver._id}
                            >

                                {driver.name}

                            </option>

                        ))}

                    </select>


                    {/* Route */}

                    <select
                        name="route"
                        value={form.route}
                        onChange={handleChange}
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


                    {/* Buttons */}

                    {id ? (

                        <div>

                            <button type="submit">
                                Update
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    ) : (

                        <button type="submit">
                            Register
                        </button>

                    )}

                </form>

            </div>


            {/* ================= TABLE ================= */}

            <div
                className="hero"
                style={{
                    overflowX: "auto"
                }}
            >

                <h1>
                    Buses
                </h1>


                <table style={{width:"100%"}}>

                    <thead
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white"
                        }}
                    >

                        <tr>

                            <th>
                                Bus Number
                            </th>

                            <th>
                                Capacity
                            </th>

                            <th>
                                Driver
                            </th>

                            <th>
                                Route
                            </th>

                            <th>
                                Status
                            </th>

                            <th colSpan={2}>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {buses.map((bus) => {

                            // Find driver
                            const driver = drivers.find(
                                (d) =>
                                    d._id ===
                                    (bus.driver?._id || bus.driver)
                            );


                            // Find route
                            const route = routes.find(
                                (r) =>
                                    r._id ===
                                    (bus.route?._id || bus.route)
                            );


                            return (

                                <tr key={bus._id}>

                                    <td>
                                        {bus.busNumber}
                                    </td>

                                    <td>
                                        {bus.capacity}
                                    </td>

                                    <td>
                                        {driver?.name || "Not assigned"}
                                    </td>

                                    <td>
                                        {route?.routeName || "Not assigned"}
                                    </td>

                                    <td>
                                        {bus.status || "inactive"}
                                    </td>

                                    <td>

                                        <button
                                            style={{
                                                backgroundColor:
                                                    "#2196F3",
                                                color: "white"
                                            }}
                                            onClick={() =>
                                                handleEdit(bus)
                                            }
                                        >
                                            Edit
                                        </button>

                                    </td>

                                    <td>

                                        <button
                                            style={{
                                                backgroundColor:
                                                    "#f44336",
                                                color: "white"
                                            }}
                                            onClick={() =>
                                                handleDelete(
                                                    bus._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </>

    );

};

export default AddBus;