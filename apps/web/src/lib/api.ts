const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return response;
}

export interface AWSResource {
  id: string;
  resourceType: string;
  resourceId: string;
  status: string;
  estimatedCost: number;
}

export interface AWSAccount {
  id: string;
  region: string;
  createdAt: string;
}

export interface ConnectAWSResponse {
  message: string;
  resourcesFetched: number;
}

export interface CostData {
  startDate: string;
  endDate: string;
  totalCost: number;
  serviceBreakdown: ServiceCost[];
}

export interface ServiceCost {
  serviceName: string;
  cost: number;
}

export const awsApi = {
  connect: async (credentials: {
    accessKey: string;
    secretKey: string;
    region: string;
  }): Promise<ConnectAWSResponse> => {
    const res = await fetchWithAuth("/aws/connect", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage = data.error?.message || data.error || "Failed to connect AWS";
      throw new Error(errorMessage);
    }
    return data;
  },

  getCostAndUsage: async (options: {
    startDate: string;
    endDate: string;
    granularity?: "DAILY" | "MONTHLY" | "HOURLY";
  }): Promise<CostData> => {
    const res = await fetchWithAuth("/aws/cost", {
      method: "POST",
      body: JSON.stringify(options),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to get cost data");
    }
    return data;
  },

  getMonthlyForecast: async (month: string): Promise<number> => {
    const res = await fetchWithAuth(`/aws/cost/forecast?month=${month}`, {
      method: "GET",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to get forecast");
    }
    return data.forecast;
  },
};
