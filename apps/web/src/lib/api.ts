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

export interface Recommendation {
  id: string;
  issue: string;
  recommendation: string;
  estimatedSavings: number;
  resourceId: string;
  resourceType: string;
  resourceIdentifier: string;
  awsAccountUsername: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  totalSavings: number;
  count: number;
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
    accountId?: string;
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
      const errorMessage = data.error?.message || data.error || "Failed to get cost data";
      throw new Error(errorMessage);
    }
    return data;
  },

  getConnectedAccounts: async () => {
    const res = await fetchWithAuth("/aws/connected-accounts");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch connected accounts");
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

  generateRecommendations: async (accountId?: string) => {
    const res = await fetchWithAuth("/aws/recommendations/generate", {
      method: "POST",
      body: JSON.stringify(accountId ? { accountId } : {}),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage = data.error?.message || data.error || "Failed to generate recommendations";
      throw new Error(errorMessage);
    }
    return data;
  },

  getRecommendations: async (accountId?: string): Promise<RecommendationResponse> => {
    const url = accountId ? `/aws/recommendations?accountId=${accountId}` : "/aws/recommendations";
    const res = await fetchWithAuth(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch recommendations");
    }
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await fetchWithAuth("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      const errorMessage = data.error?.message || data.error || "Failed to change password";
      throw new Error(errorMessage);
    }
    return data;
  },
};
