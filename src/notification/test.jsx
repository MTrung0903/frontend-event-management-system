import React, { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";

import "./Notification.css"; 
const Test = () => {
  const { stompClient } = useWebSocket();
  const userId = 1;
  useEffect(() => {
    if (stompClient) {
      stompClient.send("/app/private", {}, JSON.stringify({ title : "Thông báo", accountID: "5", message: "Hello 123" }));
    }
  }, [stompClient]);
  

  return <div>
    Detail Page
    </div>;
  
};

export default Test;
