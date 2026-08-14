import { useState, useEffect, useRef } from "react";
import api from "../axios/api";

const Driver = () => {

    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
        speed: 0,
        heading: 0
    });

    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState("");

    const watchID = useRef(null);
    const lastSentTime = useRef(0);


    useEffect(() => {

        return () => {

            if (watchID.current !== null) {

                navigator.geolocation.clearWatch(
                    watchID.current
                );

                watchID.current = null;
            }

        };

    }, []);


    const startTracking = () => {

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by this browser."
            );

            return;
        }

        // Prevent multiple watches
        if (watchID.current !== null) {
            return;
        }

        setError("");
        setTracking(true);

        watchID.current =
            navigator.geolocation.watchPosition(

                async (position) => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    const speed =
                        position.coords.speed
                            ? position.coords.speed * 3.6
                            : 0;

                    const heading =
                        position.coords.heading || 0;


                    const newLocation = {

                        lat: latitude,

                        lng: longitude,

                        speed: Number(
                            speed.toFixed(2)
                        ),

                        heading: Number(
                            heading.toFixed(2)
                        )

                    };


                    // Update UI immediately
                    setLocation(newLocation);


                    // Send API maximum once every 5 seconds
                    const now = Date.now();

                    if (
                        now - lastSentTime.current <
                        5000
                    ) {
                        return;
                    }

                    lastSentTime.current = now;


                    try {

                        await api.post(
                            "/driver-location",
                            newLocation
                        );

                        console.log(
                            "Location updated:",
                            newLocation
                        );

                    } catch (e) {

                        console.error(
                            "Location update failed:",
                            e.response?.data ||
                            e.message
                        );

                        setError(
                            e.response?.data?.message ||
                            "Failed to update location"
                        );

                    }

                },


                (error) => {

                    console.error(
                        "GPS Error:",
                        error
                    );

                    setTracking(false);

                    switch (error.code) {

                        case 1:

                            setError(
                                "Location permission denied."
                            );

                            break;

                        case 2:

                            setError(
                                "Unable to get your location."
                            );

                            break;

                        case 3:

                            setError(
                                "Location request timed out."
                            );

                            break;

                        default:

                            setError(
                                "Unknown location error."
                            );

                    }

                },


                {
                    enableHighAccuracy: true,
                    maximumAge: 5000,
                    timeout: 10000
                }

            );
    };


    const stopTracking = async () => {

        if (watchID.current !== null) {

            navigator.geolocation.clearWatch(
                watchID.current
            );

            watchID.current = null;
        }


        try {

            await api.post(
                "/driver-stop-tracking"
            );

            console.log(
                "Tracking stopped"
            );

        } catch (e) {

            console.error(
                e.response?.data ||
                e.message
            );

        }


        setTracking(false);
    };


    return (

        <div className="container">

            <h1>Driver Management</h1>

            <h2>Bus Tracking</h2>


            {error && (

                <p style={{ color: "red" }}>
                    {error}
                </p>

            )}


            <div>

                <p>

                    <strong>Status:</strong>{" "}

                    {tracking
                        ? "Tracking Active"
                        : "Tracking Stopped"}

                </p>


                <p>

                    <strong>Latitude:</strong>{" "}

                    {location.lat}

                </p>


                <p>

                    <strong>Longitude:</strong>{" "}

                    {location.lng}

                </p>


                <p>

                    <strong>Speed:</strong>{" "}

                    {location.speed} km/h

                </p>


                <p>

                    <strong>Heading:</strong>{" "}

                    {location.heading}°

                </p>

            </div>


            {!tracking ? (

                <button onClick={startTracking}>

                    Start Tracking

                </button>

            ) : (

                <button onClick={stopTracking}>

                    Stop Tracking

                </button>

            )}

        </div>

    );
};

export default Driver;