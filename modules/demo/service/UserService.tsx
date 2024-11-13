import axios from 'axios';
import { Demo } from '@/types';

class UserService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:8080/api/users';
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

    async getUsers(): Promise<any[]> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserById(_id: string): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/${_id}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async createUser(user: { username: string; name: string; roles: Demo.Role[]; password: string }): Promise<any> {
        try {
            const roles = user.roles.map(role => role._id);
            const userData = { ...user, roles };
            console.log('Creating user with data:', userData);
            const response = await axios.post(this.baseUrl, userData, {
                headers: this.getAuthHeaders()
            });
            console.log('Response from server:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error response:', error.response?.data);
            } else {
                console.error('Error creating user:', error);
            }
            throw error;
        }
    }

    async addRoleToUser(userId: string, roles: string): Promise<any> {
        try {
            const response = await axios.patch(`${this.baseUrl}/${userId}/add-role`, { roles }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding role to user:', error);
            throw error;
        }
    }

    async deleteRoleFromUser(userId: string, roles: string): Promise<any> {
        try {
            const response = await axios.patch(`${this.baseUrl}/${userId}/delete-role`, { roles }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting role from user:', error);
            throw error;
        }
    }

    async changeUserStatus(_id: string, status: boolean): Promise<any> {
        try {
            const response = await axios.put(`${this.baseUrl}/${_id}/change-status`, { status }, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error changing user status:', error);
            throw error;
        }
    }

    async updateUser(userId: string, userData: { name?: string; password?: string; roles?: string[] }): Promise<any> {
        try {
            const response = await axios.put(`${this.baseUrl}/${userId}`, userData, {
                headers: this.getAuthHeaders()
            });
            return response.data.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async changeManyUserStatus(userIds: string[], status: boolean): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/change-many-status`, { userIds, status }, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Error changing user status:', error);
            throw error;
        }
    }
}

export default UserService;
