import React, { useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketContext";

import "./Notification.css"; // File CSS riêng
const Test = () => {
  const { stompClient } = useWebSocket();
  useEffect(() => {
    if (stompClient) {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc nơi bạn lưu trữ
      stompClient.send(
        "/app/private",
        { Authorization: token }, // Thêm token vào header
        JSON.stringify({
          title: "Thông báo",
          accountID: "5",
          message: "Hello 123"
        })
      );
    }
  }, []);
  return <div>
    Detail Page
  </div>;

};

export default Test;
