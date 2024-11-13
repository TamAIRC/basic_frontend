import axios from 'axios';

class PermissionService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = 'http://localhost:8080/api/permissions';
    }
    private getAuthHeaders() {
        const token = localStorage.getItem('token'); 
        if (!token) {
            console.error('No token found in localStorage');
            throw new Error('No token found');
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    async getPermissions(page: number, limit: number): Promise<any> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: this.getAuthHeaders(),
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    }
    async createPermission(name: string): Promise<any> {
        try {
            const response = await axios.post(this.baseUrl, { name }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        }
    }
}

export default PermissionService;