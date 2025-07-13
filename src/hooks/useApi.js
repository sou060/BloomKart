import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import performanceMonitor from '../utils/performance';

// Simple cache implementation
const cache = new Map();

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    body = null,
    headers = {},
    cacheTime = 5 * 60 * 1000, // 5 minutes
    skip = false,
  } = options;

  const fetchData = useCallback(async () => {
    if (skip) {
      setLoading(false);
      return;
    }

    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
      setData(cachedData.data);
      setLoading(false);
      setError(null);
      return;
    }

    const startTime = performance.now();

    try {
      setLoading(true);
      setError(null);

      const config = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(body && { data: body }),
      };

      const response = await axios(config);
      
      const endTime = performance.now();
      performanceMonitor.trackApiCall(url, startTime, endTime);
      
      // Cache the response
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      setData(response.data);
    } catch (err) {
      const endTime = performance.now();
      performanceMonitor.trackApiCall(url, startTime, endTime);
      setError(err);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, cacheTime, skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useApi;