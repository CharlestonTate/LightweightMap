// Imgur API configuration
const IMGUR_CLIENT_ID = 'f31696551a63c9f'; // Your Imgur client ID

// Function to upload an image to Imgur
async function uploadToImgur(imageFile) {
    try {
        // Convert file to base64
        const base64Image = await fileToBase64(imageFile);
        
        // Upload to Imgur
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image.split(',')[1], // Remove data URL prefix
                type: 'base64'
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.data.error || 'Failed to upload image');
        }

        // Return the Imgur URL
        return data.data.link;
    } catch (error) {
        console.error('Error uploading to Imgur:', error);
        throw error;
    }
}

// Helper function to convert File to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Function to upload multiple images
async function uploadMultipleImages(files) {
    const uploadPromises = Array.from(files).map(file => uploadToImgur(file));
    return Promise.all(uploadPromises);
} 