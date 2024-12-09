import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Hàm helper để thêm header Authorization
const getHeaders = (token) => ({
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

// Fetch tasks theo eventId
export const fetchTasks = async (eventId, token) => {
  const response = await axios.get(`${BASE_URL}/man/event/${eventId}/tasks`, getHeaders(token));
  console.log(response.data.data) 
  return response.data.data; 
};

// Cập nhật task
export const updateTask = async (task, token) => {
    console.log(task)
  const response = await axios.put(`${BASE_URL}/man/task`, task, getHeaders(token));
  return response.data.data; 
};

// Xóa task
export const deleteTask = async (taskId, token) => {
  await axios.delete(`${BASE_URL}/man/task/${taskId}`, getHeaders(token));
};

// Tạo task mới
export const createTask = async (task, token) => {
  const response = await axios.post(`${BASE_URL}/man/task`, task, getHeaders(token));
  return response.data; 
};

//Lấy danh sách team có thể thực hiện task
export const getTeamsForTask = async (eventId,taskId, token) => {

  const response = await axios.get(`${BASE_URL}/man/event/${eventId}/teams/${taskId}`, getHeaders(token));
  return response.data.data; 
};
//Assigned team for task
export const assignedTeam = async (taskId,teamId, token) => {
  const response = await axios.put(`${BASE_URL}/man/task/${taskId}/assigned/${teamId}`,null, getHeaders(token));
  console.log('Response from API:', response);
  return response.data.data; 

};
