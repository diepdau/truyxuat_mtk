import axios from "axios";
import {
    DateConverter
} from "../../components/Date/Date.jsx";
import {
    calculateAgeInMonths
} from "../../components/Date/DateBirth.jsx";

export const handleGet = async (token, currentLimit, currentPage, value = "") => {
    try {
        const response = await fetch(
            `https://agriculture-traceability.vercel.app/api/v1/herds?limit=${currentLimit}&page=${currentPage} &searchQuery=${encodeURIComponent(value)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        data.herds.forEach((element) => { element.farm.name = calculateAgeInMonths(element.start_date);  });
        data.herds.forEach((element) => {  element.date = DateConverter(element.date);});
        return data;
    } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
    }
};
export const handleCreate = async (data, token) => {
    try {
        await axios.post("https://agriculture-traceability.vercel.app/api/v1/herds", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

export const handleDelete = async (product, token) => {
    try {
        await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/herds/${product._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};
export const handleUpdate = async (_id, data, token) => {
    try {
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/herds/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log("Error:", error);
    }
};
export const handleGetCategory = async (token) => {
    try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/categories?limit=50", );
        return response.data.categories;
    } catch (error) {
        console.log("Error: ", error);
    }
};

export const handleGetFarm = async (token) => {
    try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/farms?limit=50&searchQuery=ạ", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.farms;
    } catch (error) {
        console.log("Error: ", error);
    }
};

export const handleGetRecords = async (herdId, token, currentLimit, currentPage, value = "") => {
    try {
        const response = await fetch(
            `https://agriculture-traceability.vercel.app/api/v1/herds/${herdId}?limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
            value
          )}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        data.herd.records.forEach((element) => {
            element.birth_date = DateConverter(element.birth_date);
        });
        return data;
    } catch (error) {
        console.log("There was a problem with the fetch operation:", error);
    }
};

export const fetchHerd = async (herdId, token) => {
    try {
        const res = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/herds/${herdId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.herd;
    } catch (error) {
        console.log("Error: ", error);
    }
};
export const createNewAutoHerd = async (herdId, quantity, token) => {
    try {
        await axios.post(`https://agriculture-traceability.vercel.app/api/v1/herds/${herdId}/generate-animals`, {
            quantity: quantity,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
}





export const handleCreateAnimal = async (data, token) => {
    try {
        await axios.post("https://agriculture-traceability.vercel.app/api/v1/animals", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

export const handleDeleteAnimal = async (_id, token) => {
    try {
        await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/animals/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};
export const handleUpdateAnimal = async (_id, data, token) => {
    try {
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/animals/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log("Error:", error);
    }
};


export const fetchNotifications = async (token) => {
    try {
        const response = await axios.get("https://agriculture-traceability.vercel.app/api/v1/notifications", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.notifications
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};