import axios from "axios";

export const handleGet = async (name, token) => {
    try {
        const response = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/harvests?sort=${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.herds;
    } catch (error) {
        console.log("Error: ", error);
    }
};

export const handleGetHerdHarvest = async (_idherdhavest, token) => {
    try {
        const response = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/harvests/herd/${_idherdhavest}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log("Error: ", error);
    }
};
export const handleGetHerdHarvest1 = async (_idherdhavest, token) => {
    try {
        const response = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/harvests/herd/${_idherdhavest}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.harvests;
    } catch (error) {
        console.log("Error: ", error);
    }
};
export const handleCreate = async (data, token) => {
    const res = await axios.post("https://agriculture-traceability.vercel.app/api/v1/harvests", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res;
};

export const handleDelete = async (_id, token) => {
    try {
        await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/harvests/${_id}`, {
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
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/harvests/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log("Error: ", error);
    }
};
export const getHerd = async () => {
    try {
        const res = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/herds?limit=60`);
        return res;
    } catch (error) {
        console.log(error);
    }
};