import React, { useEffect, useState } from "react";
import api from "../axios/api";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
    assignedBus: ""
};

const AddDriver = () => {

    const [form, setForm] = useState(emptyForm);

    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [id, setId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);


    // ==========================================
    // FETCH DATA
    // ==========================================

    const fetchData = async () => {

        try {

            setFetching(true);

            const [busResponse, driverResponse] =
                await Promise.all([
                    api.get("/get-bus"),
                    api.get("/get-driver")
                ]);

            setBuses(busResponse.data || []);
            setDrivers(driverResponse.data || []);

        } catch (e) {

            console.error(
                e.response?.data || e.message
            );

            alert(
                e.response?.data?.message ||
                "Unable to load driver data"
            );

        } finally {

            setFetching(false);

        }
    };


    useEffect(() => {

        fetchData();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);


            // UPDATE

            if (id) {

                const updateData = {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    licenseNumber: form.licenseNumber,
                    assignedBus:
                        form.assignedBus || null
                };

                await api.put(
                    `/update-driver/${id}`,
                    updateData
                );

                alert(
                    "Driver updated successfully."
                );

            }

            // CREATE

            else {

                await api.post(
                    "/add-driver",
                    form
                );

                alert(
                    "Driver registered successfully."
                );

            }


            setForm(emptyForm);
            setId(null);

            await fetchData();

        } catch (e) {

            console.error(
                e.response?.data || e.message
            );

            alert(
                e.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (driver) => {

        setId(driver._id);

        setForm({
            name: driver.name || "",
            email: driver.email || "",
            phone: driver.phone || "",
            password: "",
            licenseNumber:
                driver.licenseNumber || "",
            assignedBus:
                driver.assignedBus?._id ||
                driver.assignedBus ||
                ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancel = () => {

        setId(null);
        setForm(emptyForm);

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (driverId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this driver?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(
                `/delete-driver/${driverId}`
            );

            alert(
                "Driver deleted successfully."
            );

            await fetchData();

        } catch (e) {

            console.error(
                e.response?.data || e.message
            );

            alert(
                e.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // ==========================================
    // BUS NUMBER
    // ==========================================

    const getBusNumber = (busId) => {

        if (!busId) {
            return "Not assigned";
        }

        const selectedBus = buses.find(
            (bus) => bus._id === busId
        );

        return selectedBus?.busNumber ||
            "Not assigned";

    };


    // ==========================================
    // STATISTICS
    // ==========================================

    const assignedDrivers =
        drivers.filter(
            (driver) => driver.assignedBus
        ).length;

    const availableBuses =
        buses.filter(
            (bus) => !bus.driver
        ).length;


    return (

        <div className="driver-management-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="driver-page-header">

                <div>

                    <div className="page-breadcrumb">
                        Admin / Drivers
                    </div>

                    <h1>
                        Driver Management
                    </h1>

                    <p>
                        Manage drivers, licenses and
                        bus assignments from one place.
                    </p>

                </div>


                <button
                    className="refresh-btn"
                    onClick={fetchData}
                    disabled={fetching}
                >
                    ↻{" "}
                    {fetching
                        ? "Refreshing..."
                        : "Refresh"
                    }
                </button>

            </div>


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="driver-stats">

                <div className="driver-stat-card">

                    <div className="stat-icon blue">
                        👨‍✈️
                    </div>

                    <div>
                        <span>Total Drivers</span>
                        <strong>
                            {drivers.length}
                        </strong>
                    </div>

                </div>


                <div className="driver-stat-card">

                    <div className="stat-icon green">
                        🚌
                    </div>

                    <div>
                        <span>Assigned Drivers</span>
                        <strong>
                            {assignedDrivers}
                        </strong>
                    </div>

                </div>


                <div className="driver-stat-card">

                    <div className="stat-icon orange">
                        🚍
                    </div>

                    <div>
                        <span>Available Buses</span>
                        <strong>
                            {availableBuses}
                        </strong>
                    </div>

                </div>


                <div className="driver-stat-card">

                    <div className="stat-icon purple">
                        📋
                    </div>

                    <div>
                        <span>Bus Fleet</span>
                        <strong>
                            {buses.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =====================================
                FORM
            ===================================== */}

            <div className="driver-form-card">

                <div className="section-heading">

                    <div className="section-icon">
                        {id ? "✏️" : "👨‍✈️"}
                    </div>

                    <div>

                        <h2>
                            {id
                                ? "Update Driver"
                                : "Add New Driver"
                            }
                        </h2>

                        <p>
                            {id
                                ? "Update driver information and bus assignment."
                                : "Create a driver account and assign a bus."
                            }
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="driver-form"
                >

                    <div className="form-group">

                        <label>
                            Driver Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter driver name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="driver@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter phone number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                    </div>


                    {!id && (

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Create password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    )}


                    <div className="form-group">

                        <label>
                            License Number
                        </label>

                        <input
                            type="text"
                            name="licenseNumber"
                            placeholder="e.g. GJ01-2024-12345"
                            value={form.licenseNumber}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Assign Bus
                        </label>

                        <select
                            name="assignedBus"
                            value={form.assignedBus}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a bus
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

                        <small>
                            Assigning a bus allows this driver
                            to send live GPS location.
                        </small>

                    </div>


                    <div className="form-actions">

                        {id && (

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        )}

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Please wait..."
                                : id
                                    ? "Update Driver"
                                    : "Create Driver"
                            }

                        </button>

                    </div>

                </form>

            </div>


            {/* =====================================
                DRIVER LIST
            ===================================== */}

            <div className="driver-list-card">

                <div className="list-header">

                    <div>

                        <h2>
                            Registered Drivers
                        </h2>

                        <p>
                            {drivers.length} driver
                            {drivers.length !== 1
                                ? "s"
                                : ""
                            } in your system
                        </p>

                    </div>

                    <span className="driver-count">
                        {drivers.length}
                    </span>

                </div>


                {fetching ? (

                    <div className="empty-state">

                        <div className="loading-circle">
                            ⟳
                        </div>

                        <p>
                            Loading drivers...
                        </p>

                    </div>

                ) : drivers.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            👨‍✈️
                        </div>

                        <h3>
                            No drivers yet
                        </h3>

                        <p>
                            Add your first driver using
                            the form above.
                        </p>

                    </div>

                ) : (

                    <>

                        {/* DESKTOP TABLE */}

                        <div className="driver-table-wrapper">

                            <table className="driver-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Driver
                                        </th>

                                        <th>
                                            Contact
                                        </th>

                                        <th>
                                            License
                                        </th>

                                        <th>
                                            Assigned Bus
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {drivers.map((driver) => {

                                        const assignedBusId =
                                            driver.assignedBus?._id ||
                                            driver.assignedBus;

                                        const busNumber =
                                            getBusNumber(
                                                assignedBusId
                                            );

                                        return (

                                            <tr
                                                key={driver._id}
                                            >

                                                <td>

                                                    <div className="driver-cell">

                                                        <div className="driver-avatar">
                                                            {driver.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                            }
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {driver.name}
                                                            </strong>

                                                            <span>
                                                                {driver.email}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span>
                                                        {driver.phone ||
                                                            "No phone"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="license-badge">
                                                        {driver.licenseNumber ||
                                                            "N/A"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            busNumber ===
                                                            "Not assigned"
                                                                ? "bus-badge empty"
                                                                : "bus-badge"
                                                        }
                                                    >

                                                        🚌{" "}
                                                        {busNumber}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            driver.isActive === false
                                                                ? "status-badge inactive"
                                                                : "status-badge active"
                                                        }
                                                    >

                                                        <span>
                                                            ●
                                                        </span>

                                                        {driver.isActive === false
                                                            ? "Inactive"
                                                            : "Active"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    driver
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    driver._id
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>


                        {/* MOBILE CARDS */}

                        <div className="driver-mobile-list">

                            {drivers.map((driver) => {

                                const assignedBusId =
                                    driver.assignedBus?._id ||
                                    driver.assignedBus;

                                const busNumber =
                                    getBusNumber(
                                        assignedBusId
                                    );

                                return (

                                    <div
                                        className="driver-mobile-card"
                                        key={driver._id}
                                    >

                                        <div className="mobile-driver-header">

                                            <div className="driver-cell">

                                                <div className="driver-avatar">
                                                    {driver.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()
                                                    }
                                                </div>

                                                <div>

                                                    <strong>
                                                        {driver.name}
                                                    </strong>

                                                    <span>
                                                        {driver.email}
                                                    </span>

                                                </div>

                                            </div>


                                            <span
                                                className={
                                                    driver.isActive === false
                                                        ? "status-badge inactive"
                                                        : "status-badge active"
                                                }
                                            >
                                                ●{" "}
                                                {driver.isActive === false
                                                    ? "Inactive"
                                                    : "Active"
                                                }
                                            </span>

                                        </div>


                                        <div className="mobile-driver-info">

                                            <div>

                                                <span>
                                                    Phone
                                                </span>

                                                <strong>
                                                    {driver.phone ||
                                                        "N/A"
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    License
                                                </span>

                                                <strong>
                                                    {driver.licenseNumber ||
                                                        "N/A"
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Assigned Bus
                                                </span>

                                                <strong>
                                                    🚌{" "}
                                                    {busNumber}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="mobile-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(
                                                        driver
                                                    )
                                                }
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        driver._id
                                                    )
                                                }
                                            >
                                                🗑 Delete
                                            </button>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </>

                )}

            </div>

        </div>

    );

};

export default AddDriver;