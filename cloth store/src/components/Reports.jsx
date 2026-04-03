import React, { useState, useMemo } from 'react';
import { useSales } from '../context/SalesContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Reports = () => {
  const { sales, getDailyReport } = useSales();
  const [viewType, setViewType] = useState('day'); // 'day', 'month', 'year'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const reportData = useMemo(() => {
    if (viewType === 'day') {
      return getDailyReport(selectedMonth, selectedYear);
    }
    return []; // Month/Year view can be added similarly
  }, [viewType, selectedMonth, selectedYear, sales]);

  const totalStats = reportData.reduce((acc, curr) => ({
    sales: acc.sales + curr.sales,
    revenue: acc.revenue + curr.revenue,
    cost: acc.cost + curr.cost,
    profit: acc.profit + curr.profit
  }), { sales: 0, revenue: 0, cost: 0, profit: 0 });

  const chartData = {
    labels: reportData.map(d => d.date),
    datasets: [
      {
        type: 'line',
        label: 'Profit ₹',
        borderColor: '#7a9148',
        borderWidth: 2,
        fill: false,
        data: reportData.map(d => d.profit),
        tension: 0.4,
        pointBackgroundColor: '#7a9148',
      },
      {
        type: 'bar',
        label: 'Revenue ₹',
        backgroundColor: 'rgba(122, 145, 72, 0.2)',
        data: reportData.map(d => d.revenue),
        borderColor: 'rgba(122, 145, 72, 0.5)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#9da39a', font: { family: 'Outfit' } }
      },
      tooltip: {
        backgroundColor: '#1c2117',
        titleColor: '#e4e6e3',
        bodyColor: '#e4e6e3',
        borderColor: '#2c3526',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9da39a' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9da39a' }
      }
    }
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025, 2026];

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button 
            className={`btn ${viewType === 'day' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ flex: 1, fontSize: '0.8rem' }}
            onClick={() => setViewType('day')}
          >DAY-WISE</button>
          <button 
            className={`btn ${viewType === 'month' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ flex: 1, fontSize: '0.8rem' }}
            onClick={() => setViewType('month')}
          >MONTH-WISE</button>
          <button 
            className={`btn ${viewType === 'year' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ flex: 1, fontSize: '0.8rem' }}
            onClick={() => setViewType('year')}
          >YEAR-WISE</button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={{ flex: 1 }} value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select style={{ flex: 1 }} value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          {viewType.toUpperCase()} Profit Report — {months[selectedMonth]} {selectedYear}
        </h3>
        <div style={{ height: '300px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Profit Details</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>DATE</th>
                <th>SALES</th>
                <th>REVENUE ₹</th>
                <th>COST ₹</th>
                <th>PROFIT ₹</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(row => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.sales}</td>
                  <td>₹{row.revenue.toLocaleString()}</td>
                  <td>₹{row.cost.toLocaleString()}</td>
                  <td style={{ color: row.profit >= 0 ? 'var(--accent-primary)' : 'var(--danger)', fontWeight: 500 }}>
                    ₹{row.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(122, 145, 72, 0.1)', fontWeight: 'bold' }}>
                <td>Total</td>
                <td>{totalStats.sales}</td>
                <td>₹{totalStats.revenue.toLocaleString()}</td>
                <td>₹{totalStats.cost.toLocaleString()}</td>
                <td style={{ color: totalStats.profit >= 0 ? 'var(--accent-primary)' : 'var(--danger)' }}>
                  ₹{totalStats.profit.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
