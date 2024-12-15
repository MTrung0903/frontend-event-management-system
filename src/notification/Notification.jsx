import React, { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log("Connected to WebSocket");

            // Subscribe to user-specific notifications
            stompClient.subscribe("/user/specific", (message) => {
                console.log("Received notification: ", message.body);
                toast.info(message.body, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            <ToastContainer />
        </div>
    );
};

export default Notifications;
