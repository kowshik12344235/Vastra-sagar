import React from 'react';
import { useSales } from '../context/SalesContext';
import { ShoppingBag, DollarSign, TrendingUp, BarChart } from 'lucide-react';

const Dashboard = () => {
  const { sales, getStats } = useSales();
  const { todaySales, todayRevenue, todayProfit, totalProfit } = getStats();

  // Get last 5 recent entries
  const recentEntries = sales.slice(0, 5);

  return (
    <div className="animate-fade">
      <div className="grid grid-cols-4">
        <div className="stat-card card">
          <div className="stat-icon"><ShoppingBag /></div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p>{todaySales}</p>
          </div>
        </div>
        
        <div className="stat-card card" style={{ borderLeftColor: '#fbc02d' }}>
          <div className="stat-icon" style={{ background: 'rgba(251, 192, 45, 0.1)', color: '#fbc02d' }}><DollarSign /></div>
          <div className="stat-info">
            <h3>Today's Revenue</h3>
            <p>₹{todayRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card card" style={{ borderLeftColor: '#ef5350' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 83, 80, 0.1)', color: '#ef5350' }}><TrendingUp /></div>
          <div className="stat-info">
            <h3>Today's Profit</h3>
            <p>₹{todayProfit.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card card" style={{ borderLeftColor: '#03a9f4' }}>
          <div className="stat-icon" style={{ background: 'rgba(3, 169, 244, 0.1)', color: '#03a9f4' }}><BarChart /></div>
          <div className="stat-info">
            <h3>Total Profit</h3>
            <p>₹{totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Recent Entries</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>QTY</th>
                <th>SELLING ₹</th>
                <th>PROFIT ₹</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No entries found</td>
                </tr>
              ) : (
                recentEntries.map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.quantity}</td>
                    <td style={{ fontWeight: 500 }}>₹{sale.revenue.toLocaleString()}</td>
                    <td style={{ color: sale.profit >= 0 ? 'var(--accent-primary)' : 'var(--danger)', fontWeight: 500 }}>
                      ₹{sale.profit.toLocaleString()}
                    </td>
                    <td>{sale.date.split('T')[0]}</td>
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

export default Dashboard;
