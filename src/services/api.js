import axios from "axios";

const MODE = 
  import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const api = axios.create({
  baseURL: MODE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enable cookies
});

api.interceptors.request.use(
  (config) => {
    // we can add additional headers if we want 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// add response interceptor to handle authentication error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Fix: Check if error.response exists before accessing status
    if (error.response?.status === 401) {
      // handle the case when the user is not authenticated
      localStorage.removeItem('todoapp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Authentication methods
  async login(credentials) { // Fixed: lowercase 'credentials'
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
  
  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  }
  
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  // get all tasks
  async getTasks() {
    const response = await api.get("/tasks");
    return response.data.data;
  }

  // create a new task
  async createTask(taskData) {
    const response = await api.post("/tasks/create", taskData);
    return response.data.data;
  }

  // update task
  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/update/${id}`, taskData);
    return response.data.data;
  }

  // Move task 
  async moveTask(id, stage) {
    const response = await api.put(`/tasks/move/${id}`, { stage });
    return response.data.data;
  }

  // delete task
  async deleteTask(id) {
    const response = await api.delete(`/tasks/delete/${id}`);
    return response.data.data;
  }
}

const apiService = new ApiService();
export default apiService;