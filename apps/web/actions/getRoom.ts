
import axios from "axios";
import { BACKEND_URL } from "../lib/config";

export async function getRoom(slug: string) {
    try {
        if(!slug){
            console.log("No room id");
            return
        }
        const token = localStorage.getItem("token");
        if(!token){
          console.error("no token found,kindly login")
          return;
        }
      
      const res = await axios.get(`${BACKEND_URL}/api/user/room/${slug}`,{
        headers:{
            Authorization: `${token}`
        }
      });
      console.log("res data",res.data)
      return res.data.roomId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching room:', error.response?.status, error.message);
      }
      return null; // Return null if not found
    }
  }