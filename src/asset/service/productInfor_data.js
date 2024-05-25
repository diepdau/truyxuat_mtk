import axios from "axios";

export const handleGet = async (token, currentLimit, currentPage, value = "") => {
  try {
    const response = await fetch(
      `https://agriculture-traceability.vercel.app/api/v1/product-infos?limit=${currentLimit}&page=${currentPage}&searchQuery=${encodeURIComponent(
        value
      )}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("There was a problem with the fetch operation:", error);
  }
};

export const handleGetProductInfor = async (id_product_info, token) => {
    try {
        const response = await axios.get(    `https://agriculture-traceability.vercel.app/api/v1/product-infos/${id_product_info}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log("Error: ", error);
    }
};
export const handleCreate = async (data, token) => {
    try {
        const res=  await axios.post("https://agriculture-traceability.vercel.app/api/v1/product-infos/", data, {
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
         await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/product-infos/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
};

export const handleUpdate = async (_id,data,token) => {
    try {
       const res= await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/product-infos/${_id}`,data,{
        headers: {
            Authorization: `Bearer ${token}`
        } 
    });
    return res;
    } catch (error) {
        console.log("Error: ", error);
    }
};

