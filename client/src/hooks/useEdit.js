import axios from 'axios';



const editItem = async (baseUrl, Id, updatedData) => {
    const url = `${baseUrl}/${Id}`; // Ensure URL is correctly formatted
    try {
        const res = await axios.put(url, updatedData);
        console.log('Edit successful:', res.data); // Log successful response

        // Update localStorage with the updated user data
        const userDataInLocalStorage = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({
            ...userDataInLocalStorage,
            ...updatedData
        }));

        return res.data; // Return the updated data from the response
    } catch (err) {
        console.error('Error editing:', err); // Log error for debugging
        throw err; // Throw the error for handling in the component
    }
};



export default editItem;