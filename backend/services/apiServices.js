export const deleteFile = async (url) => {
    return fetch('/api/s3/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
    });
    return response.json();
};
