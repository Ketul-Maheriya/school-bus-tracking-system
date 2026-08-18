import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios/api";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// --------------------------------------------------
// FIX LEAFLET DEFAULT MARKER ICON
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


// --------------------------------------------------
// MAP AUTO FIT COMPONENT
// --------------------------------------------------

const MapController = ({ buses }) => {

    const map = useMap();

    useEffect(() => {

        const validBuses = buses.filter((bus) => {

            const location = bus.currentLocation;

            return (
                location &&
                typeof location.lat === "number" &&
                typeof location.lng === "number"
            );

        });

        if (validBuses.length === 0) {
            return;
        }


        const bounds = validBuses.map((bus) => [

            bus.currentLocation.lat,

            bus.currentLocation.lng

        ]);


        if (bounds.length === 1) {

            map.setView(bounds[0], 14);

        } else {

            map.fitBounds(bounds, {
                padding: [50, 50]
            });

        }

    }, [buses, map]);


    return null;
};


// --------------------------------------------------
// ADMIN COMPONENT
// --------------------------------------------------

const Admin = () => {

    const [drivers, setDrivers] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedBus, setSelectedBus] = useState(null);

    const mapRef = useRef(null);


    // --------------------------------------------------
    // FETCH DASHBOARD DATA
    // --------------------------------------------------

    const fetchDashboardData = async () => {

        try {

            const [
                driverResponse,
                busResponse,
                routeResponse,
                studentResponse
            ] = await Promise.all([

                api.get("/get-driver"),

                api.get("/get-bus"),

                api.get("/get-route"),

                api.get("/get-student")

            ]);


            setDrivers(driverResponse.data);

            setBuses(busResponse.data);

            setRoutes(routeResponse.data);

            setStudents(studentResponse.data);

            setError("");

        } catch (e) {

            console.error(
                "Dashboard Error:",
                e.response?.data || e.message
            );

            setError(
                e.response?.data?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }

    };


    // --------------------------------------------------
    // REFRESH EVERY 5 SECONDS
    // --------------------------------------------------

    useEffect(() => {

        fetchDashboardData();


        const interval = setInterval(() => {

            fetchDashboardData();

        }, 5000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // --------------------------------------------------
    // CHECK LIVE TRACKING
    // --------------------------------------------------

    const isBusTracking = (bus) => {

        const updatedAt =
            bus.currentLocation?.updatedAt;


        if (!updatedAt) {
            return false;
        }


        const lastUpdate =
            new Date(updatedAt).getTime();


        const now = Date.now();


        const difference =
            now - lastUpdate;


        // GPS considered live for 30 seconds

        return difference <= 30000;

    };


    // --------------------------------------------------
    // VALID GPS LOCATION
    // --------------------------------------------------

    const hasValidLocation = (bus) => {

        const location =
            bus.currentLocation;


        return (

            location &&

            typeof location.lat === "number" &&

            typeof location.lng === "number"

        );

    };


    // --------------------------------------------------
    // ACTIVE BUSES
    // --------------------------------------------------

    const activeBuses = buses.filter((bus) => {

        return (
            isBusTracking(bus) &&
            hasValidLocation(bus)
        );

    });


    // --------------------------------------------------
    // FOCUS BUS ON MAP
    // --------------------------------------------------

    const focusBus = (bus) => {

        if (!hasValidLocation(bus)) {
            return;
        }


        setSelectedBus(bus);


        const location =
            bus.currentLocation;


        if (mapRef.current) {

            mapRef.current.setView(

                [
                    location.lat,
                    location.lng
                ],

                16

            );

        }

    };


    // --------------------------------------------------
    // FORMAT LAST UPDATED
    // --------------------------------------------------

    const getLastUpdated = (bus) => {

        const updatedAt =
            bus.currentLocation?.updatedAt;


        if (!updatedAt) {
            return "N/A";
        }


        return new Date(
            updatedAt
        ).toLocaleTimeString();

    };


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (

            <div className="container">

                <h1>Admin Dashboard</h1>

                <p>
                    Loading dashboard...
                </p>

            </div>

        );

    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <div className="admin-dashboard">


            {/* ------------------------------------------ */}
            {/* HEADER */}
            {/* ------------------------------------------ */}

            <header className="dashboard-header">

                <div>

                    <h1>
                        Good Morning, Admin 👋
                    </h1>

                    <p>
                        Monitor your transportation
                        system in real time.
                    </p>

                </div>


                <div className="dashboard-live">

                    <span className="live-dot"></span>

                    LIVE

                </div>

            </header>


            {/* ------------------------------------------ */}
            {/* ERROR */}
            {/* ------------------------------------------ */}

            {error && (

                <div className="dashboard-error">

                    {error}

                </div>

            )}


            {/* ------------------------------------------ */}
            {/* STATISTICS */}
            {/* ------------------------------------------ */}

            <section className="stats-grid">


                <div className="stat-card">

                    <div className="stat-icon">
                        👨‍✈️
                    </div>

                    <div>

                        <span>
                            Total Drivers
                        </span>

                        <h2>
                            {drivers.length}
                        </h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🚌
                    </div>

                    <div>

                        <span>
                            Total Buses
                        </span>

                        <h2>
                            {buses.length}
                        </h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>

                        <span>
                            Active Buses
                        </span>

                        <h2>
                            {activeBuses.length}
                        </h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🎓
                    </div>

                    <div>

                        <span>
                            Total Students
                        </span>

                        <h2>
                            {students.length}
                        </h2>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🗺️
                    </div>

                    <div>

                        <span>
                            Total Routes
                        </span>

                        <h2>
                            {routes.length}
                        </h2>

                    </div>

                </div>


            </section>


            {/* ------------------------------------------ */}
            {/* MAP + QUICK ACTIONS */}
            {/* ------------------------------------------ */}

            <section className="dashboard-main">


                {/* MAP */}

                <div className="tracking-panel">


                    <div className="panel-header">

                        <div>

                            <h2>
                                Live Bus Tracking
                            </h2>

                            <p>
                                {activeBuses.length}
                                {" "}
                                bus
                                {activeBuses.length !== 1
                                    ? "es"
                                    : ""
                                }
                                currently tracking
                            </p>

                        </div>


                        <span className="live-badge">

                            ● LIVE

                        </span>

                    </div>


                    <div
                        className="tracking-map"
                        
                        
                    >

                        <MapContainer
                            center={[
                                23.0225,
                                72.5714
                            ]}
                            zoom={12}
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                            ref={mapRef}
                        >

                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />


                            <MapController
                                buses={activeBuses}
                            />


                            {/* -------------------------------- */}
                            {/* ALL ACTIVE BUS MARKERS */}
                            {/* -------------------------------- */}

                            {activeBuses.map((bus) => {

                                const location =
                                    bus.currentLocation;


                                if (!location) {
                                    return null;
                                }


                                const route =
                                    bus.route;


                                return (

                                    <React.Fragment
                                        key={bus._id}
                                    >


                                        <Marker

                                            position={[
                                                location.lat,
                                                location.lng
                                            ]}

                                            eventHandlers={{
                                                click: () =>
                                                    setSelectedBus(bus)
                                            }}

                                        >

                                            <Popup>

                                                <div>

                                                    <h3>
                                                        🚌{" "}
                                                        {bus.busNumber}
                                                    </h3>


                                                    <p>

                                                        <strong>
                                                            Driver:
                                                        </strong>{" "}

                                                        {bus.driver?.name ||
                                                            "Not assigned"}

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Route:
                                                        </strong>{" "}

                                                        {route?.routeName ||
                                                            "Not assigned"}

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Speed:
                                                        </strong>{" "}

                                                        {location.speed || 0}
                                                        {" "}
                                                        km/h

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Heading:
                                                        </strong>{" "}

                                                        {location.heading || 0}
                                                        °

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Updated:
                                                        </strong>{" "}

                                                        {getLastUpdated(bus)}

                                                    </p>

                                                </div>

                                            </Popup>

                                        </Marker>


                                        {/* ROUTE */}

                                        {route?.stops?.length > 0 && (

                                            <Polyline

                                                positions={
                                                    route.stops
                                                        .filter(
                                                            stop =>
                                                                typeof stop.lat === "number" &&
                                                                typeof stop.lng === "number"
                                                        )
                                                        .map(
                                                            stop => [
                                                                stop.lat,
                                                                stop.lng
                                                            ]
                                                        )
                                                }

                                            />

                                        )}

                                    </React.Fragment>

                                );

                            })}


                        </MapContainer>


                        {/* NO ACTIVE BUS */}

                        {activeBuses.length === 0 && (

                            <div
                                className="map-empty"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform:
                                        "translate(-50%, -50%)",
                                    background:
                                        "white",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    zIndex: 1000
                                }}
                            >

                                🚌

                                <p>
                                    No buses are currently
                                    tracking.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* ------------------------------------------ */}
                {/* QUICK ACTIONS */}
                {/* ------------------------------------------ */}

                <div className="quick-panel">


                    <div className="panel-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Manage your system
                            </p>

                        </div>

                    </div>


                    <Link
                        to="/create-driver"
                        className="quick-action"
                    >

                        <span>
                            👨‍✈️
                        </span>

                        <div>

                            <strong>
                                Add Driver
                            </strong>

                            <small>
                                Create driver account
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </Link>


                    <Link
                        to="/add-bus"
                        className="quick-action"
                    >

                        <span>
                            🚌
                        </span>

                        <div>

                            <strong>
                                Add Bus
                            </strong>

                            <small>
                                Register new bus
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </Link>


                    <Link
                        to="/add-route"
                        className="quick-action"
                    >

                        <span>
                            🗺️
                        </span>

                        <div>

                            <strong>
                                Add Route
                            </strong>

                            <small>
                                Create bus route
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </Link>


                    <Link
                        to="/Add-Student"
                        className="quick-action"
                    >

                        <span>
                            🎓
                        </span>

                        <div>

                            <strong>
                                Add Student
                            </strong>

                            <small>
                                Register student
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </Link>


                </div>

            </section>


            {/* ------------------------------------------ */}
            {/* ACTIVE BUSES */}
            {/* ------------------------------------------ */}

            <section className="active-buses">


                <div className="panel-header">

                    <div>

                        <h2>
                            Bus Fleet
                        </h2>

                        <p>
                            Current transportation status
                        </p>

                    </div>


                    <Link to="/bus-tracking">
                        View All →
                    </Link>

                </div>


                <div
                    className="table-container"
                    style={{
                        overflowX: "auto"
                    }}
                >

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Bus
                                </th>

                                <th>
                                    Driver
                                </th>

                                <th>
                                    Route
                                </th>

                                <th>
                                    Speed
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Last Updated
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {buses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign:
                                                "center"
                                        }}
                                    >

                                        No buses found.

                                    </td>

                                </tr>

                            ) : (

                                buses.map((bus) => {

                                    const tracking =
                                        isBusTracking(bus);


                                    const location =
                                        bus.currentLocation;


                                    return (

                                        <tr

                                            key={bus._id}

                                            onClick={() =>
                                                focusBus(bus)
                                            }

                                            style={{
                                                cursor:
                                                    hasValidLocation(bus)
                                                        ? "pointer"
                                                        : "default"
                                            }}

                                        >

                                            <td>

                                                <strong>
                                                    🚌{" "}
                                                    {bus.busNumber}
                                                </strong>

                                            </td>


                                            <td>

                                                {bus.driver?.name ||
                                                    "Not assigned"}

                                            </td>


                                            <td>

                                                {bus.route?.routeName ||
                                                    "Not assigned"}

                                            </td>


                                            <td>

                                                {location?.speed ||
                                                    0}

                                                {" "}
                                                km/h

                                            </td>


                                            <td>

                                                {tracking ? (

                                                    <span
                                                        className="status-active"
                                                    >
                                                        ● Tracking
                                                    </span>

                                                ) : (

                                                    <span
                                                        className="status-offline"
                                                    >
                                                        ● Offline
                                                    </span>

                                                )}

                                            </td>


                                            <td>

                                                {getLastUpdated(bus)}

                                            </td>


                                        </tr>

                                    );

                                })

                            )}


                        </tbody>

                    </table>

                </div>


            </section>


            {/* ------------------------------------------ */}
            {/* SELECTED BUS DETAILS */}
            {/* ------------------------------------------ */}

            {selectedBus && (

                <section className="selected-bus-panel" >

                    <div className="panel-header">

                        <div>

                            <h2>
                                🚌 {selectedBus.busNumber}
                            </h2>

                            <p>
                                Selected bus information
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                setSelectedBus(null)
                            }
                        >
                            Close
                        </button>

                    </div>


                    <div className="bus-details-grid">


                        <div>

                            <span>
                                Driver
                            </span>

                            <strong>
                                {selectedBus.driver?.name ||
                                    "Not assigned"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Route
                            </span>

                            <strong>
                                {selectedBus.route?.routeName ||
                                    "Not assigned"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Speed
                            </span>

                            <strong>
                                {selectedBus.currentLocation?.speed ||
                                    0}
                                {" "}
                                km/h
                            </strong>

                        </div>


                        <div>

                            <span>
                                Heading
                            </span>

                            <strong>
                                {selectedBus.currentLocation?.heading ||
                                    0}
                                °
                            </strong>

                        </div>


                        <div>

                            <span>
                                Latitude
                            </span>

                            <strong>
                                {selectedBus.currentLocation?.lat ??
                                    "N/A"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Longitude
                            </span>

                            <strong>
                                {selectedBus.currentLocation?.lng ??
                                    "N/A"}
                            </strong>

                        </div>


                    </div>

                </section>

            )}


        </div>

    );

};


export default Admin;