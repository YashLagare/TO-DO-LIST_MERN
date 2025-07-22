import axios from "axios";

const API_BASE_URL =
  import.meta.env.API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiService {
    //get all tasks
  async getTasks() {
    const response = await api.get("/tasks");
    return response.data.data;
  }

  //create a new task
  async createTask(taskData){
    const response = await api.post("/tasks/create", taskData);
    return response.data.data;
  }

  // update task
  async updateTask(id, taskData){
    const response = await api.put(`/tasks/update/${id}`, taskData);
    return response.data.data;
  }

  //Move task 
  async moveTask(id,stage){
    const response = await api.put(`/tasks/move/${id}`,{stage});
    return response.data.data;
  }

  //delete task
  async deleteTask(id){
    const response = await api.delete(`/tasks/delete/${id}`);
    return response.data.data;
  }







}





const apiService = new ApiService();
export default apiService;