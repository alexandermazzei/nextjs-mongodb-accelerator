'use client';

import React, { useState } from 'react';
import { useItems, Item } from '@/hooks/useItems';

// Simple form model that matches our Item schema
interface ItemForm {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Initial form state
const initialForm: ItemForm = {
  name: '',
  description: '',
  price: 0,
  category: '',
  inStock: true,
};

export default function Items() {
  // Use custom hook for items data and operations
  const {
    items,
    loading,
    error,
    pagination,
    page,
    setPage,
    refetch,
    createItem,
    updateItem,
    deleteItem,
  } = useItems();

  // Form state
  const [form, setForm] = useState<ItemForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Special handling for checkbox type
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Submit handler for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing item
      await updateItem(editingId, form);
      setEditingId(null);
    } else {
      // Create new item
      await createItem(form);
    }
    
    // Reset form
    setForm(initialForm);
    setIsCreating(false);
  };
  
  // Start editing an item
  const handleEdit = (item: Item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      inStock: item.inStock,
    });
    setEditingId(item._id);
    setIsCreating(true);
  };
  
  // Handle item deletion
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };
  
  // Cancel editing/creating
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Items Management</h1>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Item
          </button>
        )}
      </div>
      
      {/* Error display */}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      {/* Create/Edit form */}
      {isCreating && (
        <div className="bg-white p-6 mb-6 rounded shadow-md">
          <h2 className="text-xl mb-4">{editingId ? 'Edit Item' : 'Create New Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength={60}
              />
            </div>
            
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                maxLength={500}
                rows={3}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  min={0}
                  step={0.01}
                />
              </div>
              
              <div className="flex-1">
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className="mr-2"
                id="inStock"
              />
              <label htmlFor="inStock">In Stock</label>
            </div>
            
            <div className="flex space-x-4">
              <button 
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <>
          {/* Items table */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4">
                      No items found. Create your first item!
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-500 hover:text-blue-700 mr-4"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                >
                  Previous
                </button>
                
                <span className="px-3 py-1">
                  Page {page} of {pagination.pages}
                </span>
                
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 rounded ${page === pagination.pages ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}