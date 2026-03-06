import { httpService } from "./http";
import type { AnalysisRequest, AnalysisResult, ApiResponse } from "@/type";

// Analysis endpoints
const ANALYSIS_API = {
  ANALYZE: "/analysis/analyze",
  HISTORY: "/analysis/history",
  GET_BY_ID: (id: string) => `/analysis/${id}`,
  DELETE: (id: string) => `/analysis/${id}`,
  EXPORT: (id: string) => `/analysis/${id}/export`,
};

export const analysisService = {
  analyze: async (request: AnalysisRequest): Promise<AnalysisResult | null> => {
    const response = await httpService.post<ApiResponse<AnalysisResult>>(
      ANALYSIS_API.ANALYZE,
      request
    );

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  },

  getHistory: async (page: number = 1, limit: number = 10) => {
    const response = await httpService.get<
      ApiResponse<{
        data: AnalysisResult[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>
    >(ANALYSIS_API.HISTORY, {
      params: { page, limit },
    });

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  },

  getById: async (id: string): Promise<AnalysisResult | null> => {
    const response = await httpService.get<ApiResponse<AnalysisResult>>(ANALYSIS_API.GET_BY_ID(id));

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await httpService.delete(ANALYSIS_API.DELETE(id));
      return true;
    } catch {
      return false;
    }
  },

  exportJson: async (id: string): Promise<string | null> => {
    const response = await httpService.get<ApiResponse<{ json: string }>>(ANALYSIS_API.EXPORT(id), {
      params: { format: "json" },
    });

    if (response.success && response.data) {
      return response.data.json;
    }

    return null;
  },

  exportCsv: async (id: string): Promise<string | null> => {
    const response = await httpService.get<ApiResponse<{ csv: string }>>(ANALYSIS_API.EXPORT(id), {
      params: { format: "csv" },
    });

    if (response.success && response.data) {
      return response.data.csv;
    }

    return null;
  },
};
