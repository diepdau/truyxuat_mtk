import axios from "axios";

export const urlGet ="https://agriculture-traceability.vercel.app/api/v1/diseases?limit=60";


export const handleCreate = async (data, token) => {
    try {
        const res = await axios.post("https://agriculture-traceability.vercel.app/api/v1/diseases/", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log("Error:", error);
    }
};

export const handleDelete = async (_id, token) => {
    try {
        await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/diseases/${_id}`, {
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
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/diseases/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.disease;
    } catch (error) {
        console.log("Error: ", error);
    }
};