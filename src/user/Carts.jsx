import axios from 'axios';

// Function to add an item to the cart
export async function addToCart(bookId, quantity) {
    try {
        // Retrieve stored username from localStorage
        const storedUsername = JSON.parse(localStorage.getItem('userData'));

        // Check if user data is available
        if (!storedUsername || !storedUsername.user_name) {
            return { success: false, message: 'User data is not available' };
        }

        const userName = storedUsername.user_name;

        // Prepare form data
        const formData = new FormData();
        formData.append('user_name', userName);
        formData.append('book_id', bookId);
        formData.append('quantity', quantity);

        // Make the API request to add an item to the cart
        const response = await axios.post('http://127.0.0.1:8080/manager/cart/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Handle success response
        if (response.data.code === 0) {
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        // Log the error and return a failure message
        console.error('API call failed:', error);
        return { success: false, message: 'API call failed' };
    }
}
