import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    const userName = "man1@gmail.com";
    client.connect({}, () => {
      console.log("Connected to WebSocket");
      client.subscribe(`/user/${userName}/specific`, (message) => {
        console.log("Received notification: ", message.body);
      });
      setStompClient(client);
    });

    return () => {
      if (client) {
        client.disconnect();
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
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
