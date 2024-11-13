import axios from 'axios';

class RoleService {
    private baseUrl: string;
    constructor() {
        this.baseUrl = 'http://localhost:8080/api/roles';
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
    async getRoles(page: number, limit: number): Promise<any> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: this.getAuthHeaders(),
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }
    async createRole(name: string): Promise<any> {
        try {
            const response = await axios.post(this.baseUrl, { name }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    }
    async changeRoleStatus(roleId: string, status: boolean): Promise<any> {
        try {
            const response = await axios.put(`${this.baseUrl}/${roleId}/change-status`, { status }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error changing role status:', error);
            throw error;
        }
    }
}

export default RoleService;