import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../services/api";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const userData = await apiService.login(credentials);
      localStorage.setItem("todoapp_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.log("Login error in thunk:", error);
      
      // Extract the error message properly
      let errorMessage = "Login failed";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const newUser = await apiService.signup(userData);
      localStorage.setItem("todoapp_user", JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.log("Signup error in thunk:", error);
      
      let errorMessage = "Signup failed";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      localStorage.removeItem("todoapp_user");
      return null;
    } catch (error) {
      // Even if logout fails, we clear local storage
      localStorage.removeItem("todoapp_user");
      return null;
    }
  }
);

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuth: (state) => {
      try {
        const savedUser = localStorage.getItem("todoapp_user");
        if (savedUser) {
          state.user = JSON.parse(savedUser);
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("todoapp_user");
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("todoapp_user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, checkAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;