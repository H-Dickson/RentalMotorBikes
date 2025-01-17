import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8800/api',
    withCredentials: true  // Adjust to match your backend server URL
});

const editBike = async(baseUrl, Id, updatedData) => {
    const url = `${baseUrl}/${Id}`; // Ensure URL is correctly formatted
    console.log(url)
    try {
        const res = await instance.put(url, updatedData);
        console.log('Edit successful:', res.data); // Log successful response

        return res.data; // Return the updated data from the response
    } catch (err) {
        console.error('Error editing:', err); // Log error for debugging
        throw err; // Throw the error for handling in the component
    }
};

export default editBike;