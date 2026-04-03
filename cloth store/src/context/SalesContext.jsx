import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isToday, isSameMonth, isSameYear, parseISO, startOfMonth, startOfYear, eachDayOfInterval, endOfMonth, subMonths } from 'date-fns';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('vastra_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories] = useState(['Shirt', 'Pant', 'Saree', 'Kurti', 'Dress Material', 'Other']);

  useEffect(() => {
    localStorage.setItem('vastra_sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (sale) => {
    const newSale = {
      id: Date.now().toString(),
      ...sale,
      profit: (parseFloat(sale.sellingPrice) - parseFloat(sale.costPrice)) * parseInt(sale.quantity),
      revenue: parseFloat(sale.sellingPrice) * parseInt(sale.quantity),
      cost: parseFloat(sale.costPrice) * parseInt(sale.quantity),
      date: sale.date || new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);
  };

  const deleteSale = (id) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const getStats = () => {
    const today = sales.filter(s => isToday(parseISO(s.date)));
    
    const todaySales = today.length;
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
      const count = daySales.reduce((sum, s) => sum + parseInt(s.quantity), 0);

      return {
        date: format(day, 'dd-MM-yyyy'),
        sales: count,
        revenue,
        profit,
        cost: daySales.reduce((sum, s) => sum + s.cost, 0)
      };
    }).filter(d => d.sales > 0 || isToday(parseISO(d.date)));
  };

  return (
    <SalesContext.Provider value={{ sales, categories, addSale, deleteSale, getStats, getDailyReport }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
