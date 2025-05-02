// src/utils/jwtUtil.js
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1]; // Extract the payload part of the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix Base64 URL encoding
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode token:', error.message);
        return null;
    }
};