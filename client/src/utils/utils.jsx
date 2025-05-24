import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_URL;
export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    })
}

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right'
    })
}

export const APIUrl = `${API_BASE_URL}`;