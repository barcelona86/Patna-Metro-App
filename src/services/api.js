import axios from "axios";

// const API_BASE_URL = "http://10.0.2.2:8080/api"; // For Android Emulator
// const API_BASE_URL = "http://172.24.175.119:8080/api"; // For Physical Device (Replace with your PC's IP)
const API_BASE_URL = "https://patna-metro-backend-latest.onrender.com/api"; // Deployed Backend

const api = axios.create({
  baseURL: API_BASE_URL,
});

// record a site visit 
export const recordVisit = async () => {
  try {
    await api.post("/visit");
  } catch (error) {
    console.error("Failed to record visit", error);
  }
};

// get total visit count (admin / optional)
// export const getVisitCount = async () => {
// const response = await api.get("/visit/count");
// return response.data;
// };

export default api;

