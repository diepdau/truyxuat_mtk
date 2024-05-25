import axios from "axios";

export const getuserList = async (token) => {
    try {
        const res = await axios.get("https://agriculture-traceability.vercel.app/api/v1/users?limit=50", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res;

    } catch (error) {
        console.log(error)
    }
};

export const createUserList = async (data, token) => {
    try {
        const res = await axios.post("https://agriculture-traceability.vercel.app/api/v1/users", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(res);
    } catch (error) {
        console.log(error)
    }
};
export const handleDelete = async (_id, token) => {
    try {
        const res = await axios.delete(`https://agriculture-traceability.vercel.app/api/v1/users/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(res);
    } catch (error) {
        console.log(error)
    }
};
export const getUser = async (userId, token) => {
    try {
        const res = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log(error)
    }
};

export const getUserAdmin = async (token) => {
    try {
        const res = await axios.get(`https://agriculture-traceability.vercel.app/api/v1/users/my-profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log(error)
    }
};
export const updateUserInfo = async (data, token) => {
    try {
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/users/update-user`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data.users;
    } catch (error) {
        console.log(error)
    }
};
export const changeUserPassword = async (data, token) => {
    try {
        const res = await axios.patch(`https://agriculture-traceability.vercel.app/api/v1/users/change-password`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data.users;
    } catch (error) {
        console.log(error)
    }
};

export const handleRole = async (userId, nameRole, token) => {
    try {
        const response = await axios.patch(
            `https://agriculture-traceability.vercel.app/api/v1/users/${userId}`, {
                role: nameRole,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(response);
    } catch (error) {
        console.log("Error update role:", error);
    }
};

export const getActive = async (token) => {
    try {
        const response = await axios.get(
            `https://agriculture-traceability.vercel.app/api/v1/auth/active-users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return (response)

    } catch (error) {
        console.log("Error active:", error);
        return (error);
    }
};