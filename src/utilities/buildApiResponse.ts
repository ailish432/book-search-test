import { ApiResponse } from "@source/types";

export const buildApiResponse = <T>(response: T[]): ApiResponse<T[]> => {
    const count = response.length;
    return {
        results: response,
        count
    }
}
