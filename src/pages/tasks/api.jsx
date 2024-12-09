import React, { useState, useEffect } from "react";
import axios from "axios";

export const createTask = async (task) => {
  const response = await axios.post(`http://localhost:8080/man/task`, task, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};
export const fetchEmployees = async (teamId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/man/team/${teamId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.listEmployees || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/task/${taskId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};

export const deleteSubTask = async (subtakId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/man/subtask/${subtakId}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return response.data;
  } catch (error) {
    console.error("Error delete subtask:", error);
    throw error;
  }
};

export const saveSubtask = async (taskId, formData) => {
  const formattedTaskDl = new Date(formData.subTaskDeadline)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  formData.subTaskDeadline = formattedTaskDl;
  try {
    const response = await axios.post(
      `http://localhost:8080/man/subtask/${taskId}`,
      formData,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    console.log("Subtask saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving subtask:", error);
    throw error;
  }
};
export const updateTask = async (task) => {
  const response = await axios.put(`http://localhost:8080/man/task`, task, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return response.data.data;
};

export const updateSubtask = async (subtask) => {
  const response = await axios.put(
    `http://localhost:8080/man/subtask`,
    subtask,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return response.data.data;
};