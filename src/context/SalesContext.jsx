import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isToday, isSameMonth, isSameYear, parseISO, startOfMonth, startOfYear, eachDayOfInterval, endOfMonth, subMonths } from 'date-fns';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState(['Shirt', 'Pant', 'Kids', 'Vests', 'Briefs', 'Suits', 'Party Wear', 'Other']);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();
      // Ensure numeric values are numbers
      const formattedData = data.map(s => ({
        ...s,
        quantity: parseInt(s.quantity),
        costPrice: parseFloat(s.costPrice),
        sellingPrice: parseFloat(s.sellingPrice),
        profit: parseFloat(s.profit),
        revenue: parseFloat(s.sellingPrice) * parseInt(s.quantity),
        cost: parseFloat(s.costPrice) * parseInt(s.quantity)
      }));
      setSales(formattedData);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale) => {
    const profit = (parseFloat(sale.sellingPrice) - parseFloat(sale.costPrice)) * parseInt(sale.quantity);
    const newSale = {
      id: Date.now().toString(),
      ...sale,
      profit,
      date: sale.date || new Date().toISOString()
    };

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });
      if (response.ok) {
        // Add locally to avoid full refresh
        setSales(prev => [{
          ...newSale,
          revenue: parseFloat(sale.sellingPrice) * parseInt(sale.quantity),
          cost: parseFloat(sale.costPrice) * parseInt(sale.quantity)
        }, ...prev]);
        return true;
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    }
    return false;
  };

  const deleteSale = async (id) => {
    try {
      const response = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSales(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const getStats = () => {
    const today = sales.filter(s => isToday(parseISO(s.date)));
    
    const todaySales = today.reduce((sum, s) => sum + s.quantity, 0);
    const todayRevenue = today.reduce((sum, s) => sum + s.revenue, 0);
    const todayProfit = today.reduce((sum, s) => sum + s.profit, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

    return { todaySales, todayRevenue, todayProfit, totalProfit };
  };

  const getDailyReport = (month, year) => {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(startDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const daySales = sales.filter(s => format(parseISO(s.date), 'yyyy-MM-dd') === dayStr);
      
      const revenue = daySales.reduce((sum, s) => sum + s.revenue, 0);
      const profit = daySales.reduce((sum, s) => sum + s.profit, 0);
      const count = daySales.reduce((sum, s) => sum + s.quantity, 0);

      return {
        date: format(day, 'dd-MM-yyyy'),
        sales: count,
        revenue,
        profit,
        cost: daySales.reduce((sum, s) => sum + s.cost, 0),
        isToday: isToday(day) // Track it here for easy filtering
      };
    }).filter(d => d.sales > 0 || d.isToday);
  };

  return (
    <SalesContext.Provider value={{ sales, categories, addSale, deleteSale, getStats, getDailyReport, loading }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
