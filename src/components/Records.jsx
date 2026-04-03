import React, { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { Search, Filter, Trash2 } from 'lucide-react';

const Records = () => {
  const { sales, categories, deleteSale } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || sale.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      deleteSale(id);
    }
  };

  return (
    <div className="animate-fade">
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Sales Records</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Search Item</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category Filter</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All Categories">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '5px' }}>
            <Filter size={18} /> APPLY FILTER
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>CATEGORY</th>
                <th>QTY</th>
                <th>COST ₹</th>
                <th>SELLING ₹</th>
                <th>PROFIT ₹</th>
                <th>DATE</th>
                <th>CUSTOMER</th>
                <th>PAYMENT</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>No records found</td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td style={{ fontWeight: 500 }}>{sale.name}</td>
                    <td>{sale.category}</td>
                    <td>{sale.quantity}</td>
                    <td>₹{sale.costPrice.toLocaleString()}</td>
                    <td>₹{sale.sellingPrice.toLocaleString()}</td>
                    <td style={{ color: sale.profit >= 0 ? 'var(--accent-primary)' : 'var(--danger)', fontWeight: 500 }}>
                      ₹{sale.profit.toLocaleString()}
                    </td>
                    <td>{sale.date.split('T')[0]}</td>
                    <td>{sale.customerName || 'Walk-in'}</td>
                    <td><span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem', 
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)' 
                    }}>{sale.paymentMode}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(sale.id)} className="btn btn-danger">
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Records;
