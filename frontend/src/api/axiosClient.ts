import axios from "axios";

const axiosClient = axios.create({
    baseURL: window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api.book4myhealth.info",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export default axiosClient