import React, { useEffect, useState } from "react";
import api from "../axios/api";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    CircleMarker
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


const Parent = () => {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const getStudents = async () => {

        try {

            const response = await api.get("/my-students");

            setStudents(response.data);

            setError("");

        } catch (e) {

            console.log(e);

            setError(
                e.response?.data?.message ||
                "Unable to load students"
            );

        } finally {

            setLoading(false);

        }

    };


    // Load students + refresh every 5 seconds
    useEffect(() => {

        getStudents();

        const interval = setInterval(() => {
            getStudents();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    if (loading) {
        return <h2>Loading...</h2>;
    }


    if (error) {
        return <h2>{error}</h2>;
    }


    return (

        <div className="parent-dashboard">

            <h1>Parent Dashboard</h1>


            {students.length === 0 ? (

                <p>No students found.</p>

            ) : (

                students.map((student) => {

                    const bus = student.bus;

                    const location = bus?.currentLocation;

                    const route = student.route;


                    /*
                    --------------------------------
                    Check valid GPS location
                    --------------------------------
                    */

                    const hasLocation =
                        location &&
                        typeof location.lat === "number" &&
                        typeof location.lng === "number";


                    /*
                    --------------------------------
                    Route coordinates
                    --------------------------------
                    */

                    const validStops =
                        route?.stops
                            ?.filter(
                                stop =>
                                    Number.isFinite(Number(stop.lat)) &&
                                    Number.isFinite(Number(stop.lng))
                            )
                            .sort(
                                (a, b) =>
                                    Number(a.order ?? 0) -
                                    Number(b.order ?? 0)
                            ) || [];


                    const routeCoordinates =
                        validStops.map(stop => [
                            Number(stop.lat),
                            Number(stop.lng)
                        ]);


                    /*
                    --------------------------------
                    Pickup stop
                    --------------------------------
                    */

                    const pickupStop = route?.stops?.find(
                        stop => stop.name === student.pickupStop
                    );


                    /*
                    --------------------------------
                    Last update time
                    --------------------------------
                    */

                    let lastUpdated = "Never";

                    let isLive = false;

                    if (location?.updatedAt) {

                        const updatedTime =
                            new Date(location.updatedAt);

                        lastUpdated =
                            updatedTime.toLocaleTimeString();

                        const difference =
                            Date.now() - updatedTime.getTime();

                        // Consider GPS live if updated
                        // within the last 20 seconds
                        isLive = difference <= 20000;

                    }


                    /*
                    --------------------------------
                    Bus status
                    --------------------------------
                    */

                    let trackingStatus = "Offline";

                    if (isLive) {

                        trackingStatus = "Live";

                    } else if (bus?.status === "active") {

                        trackingStatus = "Waiting for GPS";

                    }

                   

                    return (

                        <div
                            key={student._id}
                            className="hero"
                        >

                            {/* =========================
                                STUDENT INFORMATION
                            ========================== */}

                            <h2>{student.name}</h2>


                            <p>
                                <strong>Standard:</strong>{" "}
                                {student.standard || "N/A"}
                            </p>


                            <p>
                                <strong>Pickup Stop:</strong>{" "}
                                {student.pickupStop || "N/A"}
                            </p>


                            <p>
                                <strong>Bus:</strong>{" "}
                                {bus?.busNumber || "Not assigned"}
                            </p>


                            <p>
                                <strong>Route:</strong>{" "}
                                {route?.routeName || "Not assigned"}
                            </p>


                            {/* =========================
                                BUS INFORMATION
                            ========================== */}

                            {bus && (

                                <div className="bus-info">

                                    <h3>
                                        Bus Information
                                    </h3>


                                    <p>

                                        <strong>
                                            Tracking:
                                        </strong>{" "}

                                        {trackingStatus}

                                    </p>


                                    <p>

                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {bus.status || "Unknown"}

                                    </p>


                                    <p>

                                        <strong>
                                            Speed:
                                        </strong>{" "}

                                        {location?.speed || 0}
                                        {" "}km/h

                                    </p>


                                    <p>

                                        <strong>
                                            Heading:
                                        </strong>{" "}

                                        {location?.heading || 0}
                                        °

                                    </p>


                                    <p>

                                        <strong>
                                            Driver:
                                        </strong>{" "}

                                        {bus.driver?.name || "N/A"}

                                    </p>


                                    <p>

                                        <strong>
                                            Phone:
                                        </strong>{" "}

                                        {bus.driver?.phone || "N/A"}

                                    </p>


                                    <p>

                                        <strong>
                                            Last Updated:
                                        </strong>{" "}

                                        {lastUpdated}

                                    </p>

                                </div>

                            )}



                            {/* =========================
                                MAP
                            ========================== */}

                                <div className="hero">
                            {hasLocation ? (

                                <div
                                    className="map-container"
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >

                                    <MapContainer

                                        center={[
                                            location.lat,
                                            location.lng
                                        ]}

                                        zoom={14}

                                        style={{
                                            height: "450px",
                                            width: "100%"
                                        }}

                                    >

                                        {/* OpenStreetMap */}

                                        <TileLayer

                                            attribution='&copy; OpenStreetMap contributors'

                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                                        />


                                        {/* =====================
                                            BUS LOCATION
                                        ====================== */}

                                        <Marker
                                            position={[
                                                location.lat,
                                                location.lng
                                            ]}
                                        >

                                            <Popup>

                                                <strong>
                                                    🚌 Bus{" "}
                                                    {bus.busNumber}
                                                </strong>

                                                <br />

                                                Status:{" "}
                                                {trackingStatus}

                                                <br />

                                                Speed:{" "}
                                                {location.speed || 0}
                                                {" "}km/h

                                                <br />

                                                Latitude:{" "}
                                                {location.lat}

                                                <br />

                                                Longitude:{" "}
                                                {location.lng}

                                                <br />

                                                Updated:{" "}
                                                {lastUpdated}

                                            </Popup>

                                        </Marker>


                                        {/* =====================
                                            ROUTE LINE
                                        ====================== */}

                                        {routeCoordinates.length >= 2 && (

                                            <Polyline

                                                positions={
                                                    routeCoordinates
                                                }

                                            />

                                        )}


                                        {/* =====================
                                            ROUTE STOPS
                                        ====================== */}

                                        {route?.stops
                                            ?.filter(
                                                stop =>
                                                    Number.isFinite(Number(stop.lat)) &&
                                                    Number.isFinite(Number(stop.lng))
                                            )
                                            .map((stop, index) => (

                                                <CircleMarker
                                                    key={`${student._id}-stop-${index}`}
                                                    center={[
                                                        Number(stop.lat),
                                                        Number(stop.lng)
                                                    ]}
                                                    radius={7}
                                                >

                                                    <Popup>

                                                        <strong>
                                                            📍 {stop.name || `Stop ${index + 1}`}
                                                        </strong>

                                                        <br />

                                                        Stop #{stop.order ?? index + 1}

                                                    </Popup>

                                                </CircleMarker>

                                            ))
                                        }

                                        {/* =====================
                                            PICKUP STOP
                                        ====================== */}

                                        {pickupStop &&
                                            Number.isFinite(Number(pickupStop.lat)) &&
                                            Number.isFinite(Number(pickupStop.lng)) && (

                                                <CircleMarker
                                                    center={[
                                                        Number(pickupStop.lat),
                                                        Number(pickupStop.lng)
                                                    ]}
                                                    radius={12}
                                                >

                                                    <Popup>

                                                        <strong>
                                                            🏠 Pickup Stop
                                                        </strong>

                                                        <br />

                                                        {pickupStop.name}

                                                    </Popup>

                                                </CircleMarker>

                                            )}

                                    </MapContainer>

                                </div>

                            ) : (

                                <div>

                                    <p>
                                        🚌 Bus location is not
                                        available.
                                    </p>

                                    <p>
                                        Waiting for driver to
                                        start tracking...
                                    </p>

                                </div>

                            )}
                            </div>

                        </div>

                    );

                  

                })

            )}

        </div>

    );

};


export default Parent;