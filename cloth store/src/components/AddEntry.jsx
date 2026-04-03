import React, { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

const AddEntry = () => {
  const { categories, addSale } = useSales();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    quantity: 1,
    costPrice: '',
    sellingPrice: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    paymentMode: 'UPI'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSale({
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0
    });
    alert('Entry added successfully!');
    setFormData({
      name: '',
      category: categories[0],
      quantity: 1,
      costPrice: '',
      sellingPrice: '',
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      paymentMode: 'UPI'
    });
    navigate('/');
  };

  const handleClear = () => {
    setFormData({
      name: '',
      category: categories[0],
      quantity: 1,
      costPrice: '',
      sellingPrice: '',
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      paymentMode: 'UPI'
    });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>New Sale Entry</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ITEM / DRESS NAME</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Shirt, Pant"
              required
            />
          </div>

          <div className="form-group">
            <label>CATEGORY</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label>QUANTITY</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>DATE</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label>COST PRICE (₹ PER UNIT)</label>
              <input
                type="number"
                step="0.01"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>SELLING PRICE (₹ PER UNIT)</label>
              <input
                type="number"
                step="0.01"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>CUSTOMER NAME (OPTIONAL)</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Walk-in"
            />
          </div>

          <div className="form-group">
            <label>PAYMENT MODE</label>
            <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Plus size={18} /> ADD ENTRY
            </button>
            <button type="button" onClick={handleClear} className="btn btn-outline" style={{ flex: 1 }}>
              <Trash2 size={18} /> CLEAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntry;
