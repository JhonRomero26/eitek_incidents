const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface ApiErrorResponse {
    message?: string;
    error?: string;
    status?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = "Error de conexión con el servidor";
        
        try {
            const errorData: ApiErrorResponse = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch {
            switch (response.status) {
                case 400:
                    errorMessage = "Datos inválidos en la solicitud";
                    break;
                case 401:
                    errorMessage = "No autorizado. Por favor, inicie sesión";
                    break;
                case 403:
                    errorMessage = "No tiene permisos para realizar esta acción";
                    break;
                case 404:
                    errorMessage = "El recurso solicitado no existe";
                    break;
                case 500:
                    errorMessage = "Error interno del servidor";
                    break;
                default:
                    errorMessage = `Error del servidor (${response.status})`;
            }
        }
        
        throw new Error(errorMessage);
    }
    
    if (response.status === 204) {
        return {} as T;
    }
    
    return response.json();
}

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return handleResponse<T>(response);
    }

    async put<T>(endpoint: string, data: unknown): Promise<T> {
        const options: RequestInit = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        };
        
        if (data !== null && data !== undefined) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, options);

        return handleResponse<T>(response);
    }

    async delete(endpoint: string, headers?: Record<string, string>): Promise<void> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        });

        await handleResponse<void>(response);
    }
}
