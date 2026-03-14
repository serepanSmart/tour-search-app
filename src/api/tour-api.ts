import {
  startSearchPrices as startSearchPricesRaw,
  getSearchPrices as getSearchPricesRaw,
  stopSearchPrices as stopSearchPricesRaw,
  getHotels as getHotelsRaw,
} from '@/mock-api/api';
import type {
  StartSearchResponse,
  GetSearchPricesResponse,
  StopSearchResponse,
  HotelsMap,
  ErrorResponse,
} from '@/models';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStartSearchResponse = (data: unknown): data is StartSearchResponse => {
  if (!isObject(data)) {
    return false;
  }
  return typeof data.token === 'string' && typeof data.waitUntil === 'string';
};

const isGetSearchPricesResponse = (
  data: unknown
): data is GetSearchPricesResponse => {
  if (!isObject(data)) {
    return false;
  }
  return isObject(data.prices);
};

const isStopSearchResponse = (data: unknown): data is StopSearchResponse => {
  if (!isObject(data)) {
    return false;
  }
  return typeof data.message === 'string';
};

const isHotelsMap = (data: unknown): data is HotelsMap => {
  if (!isObject(data)) {
    return false;
  }
  return true;
};

const isErrorResponse = (data: unknown): data is ErrorResponse => {
  if (!isObject(data)) {
    return false;
  }
  return (
    typeof data.code === 'number' &&
    data.error === true &&
    typeof data.message === 'string'
  );
};

const parseResponse = async <T>(
  response: Response,
  guard: (data: unknown) => data is T
): Promise<T> => {
  const data: unknown = await response.json();
  if (!guard(data)) {
    throw new Error('Invalid response format');
  }
  return data;
};

class ApiError extends Error {
  constructor(public readonly errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.name = 'ApiError';
  }
}

const parseErrorResponse = async (response: Response): Promise<never> => {
  const data: unknown = await response.json();
  if (!isErrorResponse(data)) {
    throw new Error('Invalid error response format');
  }
  throw new ApiError(data);
};

export const tourApi = {
  startSearchPrices: async (
    countryID: string
  ): Promise<StartSearchResponse> => {
    try {
      const response = await startSearchPricesRaw(countryID);
      return parseResponse(response, isStartSearchResponse);
    } catch (error) {
      if (error instanceof Response) {
        return parseErrorResponse(error);
      }
      throw error;
    }
  },

  getSearchPrices: async (token: string): Promise<GetSearchPricesResponse> => {
    try {
      const response = await getSearchPricesRaw(token);
      return parseResponse(response, isGetSearchPricesResponse);
    } catch (error) {
      if (error instanceof Response) {
        return parseErrorResponse(error);
      }
      throw error;
    }
  },

  stopSearchPrices: async (token: string): Promise<StopSearchResponse> => {
    try {
      const response = await stopSearchPricesRaw(token);
      return parseResponse(response, isStopSearchResponse);
    } catch (error) {
      if (error instanceof Response) {
        return parseErrorResponse(error);
      }
      throw error;
    }
  },

  getHotels: async (countryID: string): Promise<HotelsMap> => {
    const response = await getHotelsRaw(countryID);
    return parseResponse(response, isHotelsMap);
  },
};
