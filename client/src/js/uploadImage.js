export const uploadToCloudinary = async (file) => {
    try {
        const sigRes = await fetch('http://localhost:8000/ask_neigh/cloudinary/sign-upload', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!sigRes.ok) throw new Error("Failed to get upload signature");
        
        const { timestamp, signature } = await sigRes.json();

        const cloudData = new FormData();
        cloudData.append('file', file);
        cloudData.append('api_key', '824789118421859'); // Replace with your key
        cloudData.append('timestamp', timestamp);
        cloudData.append('signature', signature);

        // Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary Cloud Name
        const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/nsrfsf5j/image/upload', {
            method: 'POST',
            body: cloudData
        });

        const cloudinaryResult = await cloudinaryRes.json();
        return cloudinaryResult.secure_url; 
        
    } catch (err) {
        console.error("Cloudinary Upload Error: ", err);
        throw err;
    }
}