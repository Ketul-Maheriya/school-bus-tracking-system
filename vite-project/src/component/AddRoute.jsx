import React, { useEffect, useState } from "react";
import api from "../axios/api";

const AddRoute = () => {

    const [form, setForm] = useState({
        routeName: "",
        stops: [
            {
                name: "",
                lat: "",
                lng: "",
                order: 1
            }
        ]
    });

    const [routes, setRoutes] = useState([]);
    const [id, setId] = useState(null);


    // =====================================
    // FETCH ROUTES
    // =====================================

    const fetchRoutes = async () => {

        try {

            const response = await api.get("/get-route");

            setRoutes(response.data);

        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Unable to fetch routes"
            );

        }

    };


    useEffect(() => {

        fetchRoutes();

    }, []);


    // =====================================
    // ROUTE NAME CHANGE
    // =====================================

    const handleRouteNameChange = (e) => {

        setForm({
            ...form,
            routeName: e.target.value
        });

    };


    // =====================================
    // STOP CHANGE
    // =====================================

    const handleStopChange = (index, field, value) => {

        const updatedStops = [...form.stops];

        updatedStops[index] = {
            ...updatedStops[index],
            [field]: value
        };

        setForm({
            ...form,
            stops: updatedStops
        });

    };


    // =====================================
    // ADD NEW STOP
    // =====================================

    const addStop = () => {

        setForm({
            ...form,

            stops: [
                ...form.stops,
                {
                    name: "",
                    lat: "",
                    lng: "",
                    order: form.stops.length + 1
                }
            ]

        });

    };


    // =====================================
    // REMOVE STOP
    // =====================================

    const removeStop = (index) => {

        if (form.stops.length === 1) {

            alert("Route must have at least one stop.");

            return;
        }


        const updatedStops = form.stops
            .filter((_, i) => i !== index)
            .map((stop, i) => ({
                ...stop,
                order: i + 1
            }));


        setForm({
            ...form,
            stops: updatedStops
        });

    };


    // =====================================
    // SUBMIT ROUTE
    // =====================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Validate route name

        if (!form.routeName.trim()) {

            alert("Please enter route name.");

            return;
        }


        // Validate stops

        for (const stop of form.stops) {

            if (!stop.name.trim()) {

                alert("Please enter stop name.");

                return;
            }


            if (
                stop.lat === "" ||
                stop.lng === ""
            ) {

                alert(
                    "Please enter latitude and longitude for every stop."
                );

                return;
            }


            const lat = Number(stop.lat);
            const lng = Number(stop.lng);


            if (
                Number.isNaN(lat) ||
                Number.isNaN(lng)
            ) {

                alert(
                    "Latitude and longitude must be valid numbers."
                );

                return;
            }


            if (lat < -90 || lat > 90) {

                alert(
                    "Latitude must be between -90 and 90."
                );

                return;
            }


            if (lng < -180 || lng > 180) {

                alert(
                    "Longitude must be between -180 and 180."
                );

                return;
            }

        }


        // Convert coordinates to Number

        const routeData = {

            routeName: form.routeName.trim(),

            stops: form.stops.map((stop, index) => ({

                name: stop.name.trim(),

                lat: Number(stop.lat),

                lng: Number(stop.lng),

                order: index + 1

            }))

        };


        try {

            if (id) {

                await api.put(
                    `/update-route/${id}`,
                    routeData
                );

                alert("Route updated successfully.");

            } else {

                await api.post(
                    "/add-route",
                    routeData
                );

                alert("Route added successfully.");

            }


            // Reset

            resetForm();

            fetchRoutes();


        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Something went wrong"
            );

        }

    };


    // =====================================
    // EDIT ROUTE
    // =====================================

    const handleEdit = (route) => {

        setId(route._id);

        setForm({

            routeName: route.routeName || "",

            stops: route.stops?.map((stop, index) => ({

                name: stop.name || "",

                lat: stop.lat ?? "",

                lng: stop.lng ?? "",

                order: index + 1

            })) || [
                {
                    name: "",
                    lat: "",
                    lng: "",
                    order: 1
                }
            ]

        });

    };


    // =====================================
    // DELETE ROUTE
    // =====================================

    const handleDelete = async (routeId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this route?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/delete-route/${routeId}`
            );

            alert("Route deleted successfully.");

            fetchRoutes();

        } catch (e) {

            console.log(e);

            alert(
                e.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // =====================================
    // RESET FORM
    // =====================================

    const resetForm = () => {

        setId(null);

        setForm({

            routeName: "",

            stops: [
                {
                    name: "",
                    lat: "",
                    lng: "",
                    order: 1
                }
            ]

        });

    };


    return (

        <>

            {/* ================================= */}
            {/* ROUTE FORM */}
            {/* ================================= */}

            <div
                className="container"
                style={{
                    gridColumn: "auto"
                }}
            >

                <h1>
                    {id ? "Update Route" : "Add Route"}
                </h1>


                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gap: "15px"
                    }}
                >

                    {/* Route Name */}

                    <input
                        type="text"
                        placeholder="Route Name"
                        value={form.routeName}
                        onChange={handleRouteNameChange}
                        required
                    />



                    
                    <h3>
                        Route Stops
                    </h3>


                    {/* ================================= */}
                    {/* STOPS */}
                    {/* ================================= */}

                    {form.stops.map((stop, index) => (

                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                borderRadius: "8px",
                                display: "grid",
                                gap: "10px"
                            }}
                        >

                            <h4>
                                Stop {index + 1}
                            </h4>


                            {/* Stop Name */}

                            <input
                                type="text"
                                placeholder="Stop Name"
                                value={stop.name}
                                onChange={(e) =>
                                    handleStopChange(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                                required
                            />


                            {/* Latitude */}

                            <input
                                type="number"
                                step="any"
                                placeholder="Latitude"
                                value={stop.lat}
                                onChange={(e) =>
                                    handleStopChange(
                                        index,
                                        "lat",
                                        e.target.value
                                    )
                                }
                                required
                            />


                            {/* Longitude */}

                            <input
                                type="number"
                                step="any"
                                placeholder="Longitude"
                                value={stop.lng}
                                onChange={(e) =>
                                    handleStopChange(
                                        index,
                                        "lng",
                                        e.target.value
                                    )
                                }
                                required
                            />


                            {/* Remove */}

                            <button
                                type="button"
                                onClick={() =>
                                    removeStop(index)
                                }
                                style={{
                                    backgroundColor: "#f44336",
                                    color: "white"
                                }}
                            >
                                Remove Stop
                            </button>

                        </div>

                    ))}


                    {/* ================================= */}
                    {/* ADD STOP */}
                    {/* ================================= */}

                    <button
                        type="button"
                        onClick={addStop}
                    >
                        + Add Stop
                    </button>


                    {/* ================================= */}
                    {/* SUBMIT */}
                    {/* ================================= */}

                    <div>

                        <button type="submit">

                            {id
                                ? "Update Route"
                                : "Register Route"}

                        </button>


                        {id && (

                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>


            {/* ================================= */}
            {/* ROUTE TABLE */}
            {/* ================================= */}

            <div
                className="hero"
                style={{
                    overflowX: "auto"
                }}
            >

                <h1>
                    Routes
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
                                Route Name
                            </th>

                            <th>
                                Total Stops
                            </th>

                            <th>
                                Stops
                            </th>

                            <th colSpan={2}>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {routes.map((route) => (

                            <tr key={route._id}>

                                <td>
                                    {route.routeName}
                                </td>


                                <td>
                                    {route.stops?.length || 0}
                                </td>


                                <td>

                                    {route.stops?.map(
                                        (stop, index) => (

                                            <div
                                                key={`${route._id}-${index}`}
                                            >

                                                {index + 1}.
                                                {" "}
                                                {stop.name}

                                            </div>

                                        )
                                    )}

                                </td>


                                {/* EDIT */}

                                <td>

                                    <button
                                        style={{
                                            backgroundColor:
                                                "#2196F3",
                                            color: "white"
                                        }}
                                        onClick={() =>
                                            handleEdit(route)
                                        }
                                    >
                                        Edit
                                    </button>

                                </td>


                                {/* DELETE */}

                                <td>

                                    <button
                                        style={{
                                            backgroundColor:
                                                "#f44336",
                                            color: "white"
                                        }}
                                        onClick={() =>
                                            handleDelete(
                                                route._id
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

export default AddRoute;