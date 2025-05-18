import { useState, useEffect } from 'react';

// Types
export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface FetchItemsResponse {
  success: boolean;
  data: Item[];
  pagination: Pagination;
}

interface FetchSingleItemResponse {
  success: boolean;
  data: Item;
}

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

// Main hook for fetching items
export function useItems(initialPage = 1, initialLimit = 10) {
  const [state, setState] = useState<ItemsState>({
    items: [],
    loading: true,
    error: null,
    pagination: null,
  });
  
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [category, setCategory] = useState<string | null>(null);
  const [inStock, setInStock] = useState<boolean | null>(null);
  
  // Fetch items with query parameters
  const fetchItems = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (category) params.append('category', category);
      if (inStock !== null) params.append('inStock', inStock.toString());
      
      const response = await fetch(`/api/items?${params.toString()}`);
      const result: FetchItemsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.success ? 'Unknown error' : 'Failed to fetch items');
      }
      
      setState({
        items: result.data,
        loading: false,
        error: null,
        pagination: result.pagination,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch items',
      }));
    }
  };
  
  // Get a single item by ID
  const getItem = async (id: string): Promise<Item | null> => {
    try {
      const response = await fetch(`/api/items/${id}`);
      const result: FetchSingleItemResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to fetch item');
      }
      
      return result.data;
    } catch (error) {
      return null;
    }
  };
  
  // Create a new item
  const createItem = async (item: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>): Promise<Item | null> => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create item');
      }
      
      // Refresh items list
      fetchItems();
      
      return result.data;
    } catch (error) {
      return null;
    }
  };
  
  // Update an item
  const updateItem = async (id: string, updates: Partial<Item>): Promise<Item | null> => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update item');
      }
      
      // Refresh items list
      fetchItems();
      
      return result.data;
    } catch (error) {
      return null;
    }
  };
  
  // Delete an item
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete item');
      }
      
      // Refresh items list
      fetchItems();
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Fetch items when dependencies change
  useEffect(() => {
    fetchItems();
  }, [page, limit, category, inStock]);
  
  return {
    ...state,
    page,
    limit,
    category,
    inStock,
    setPage,
    setLimit,
    setCategory,
    setInStock,
    refetch: fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
  };
}