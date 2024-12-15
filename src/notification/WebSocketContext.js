import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const CustomToast = ({ title, message }) => (
    <div>
      <strong>{title}</strong>
      <div>{message}</div>
    </div>
  );
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    const token = localStorage.getItem("token");
    let payload
    let userId
    if(token){
      payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.userId;
    }
   
    client.connect({}, () => {
      console.log("Connected to WebSocket");
      client.subscribe(`/user/${userId}/specific`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("Received notification: ", parsedMessage);

        // Hiển thị thông báo
        toast.info(<CustomToast title="Thông báo mới" message={parsedMessage.message || "Bạn có một thông báo mới!"} />, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
      setStompClient(client);
    });

    return () => {
      if (client) {
        client.disconnect(() => console.log("Disconnected from WebSocket"));
      }
    };
  }, []);

  const subscribe = (destination, callback) => {
    if (stompClient) {
      return stompClient.subscribe(destination, callback);
    }
    console.error("stompClient is not initialized");
  };

  return (
    <WebSocketContext.Provider value={{ stompClient }}>
      {children}
      <ToastContainer /> {/* Đảm bảo ToastContainer được render */}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
