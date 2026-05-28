import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { dash: [4, 4] },
        grid: {
          color: '#f3f4f6',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const lineChartData = {
    labels: stats?.chartData?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }) || [],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: stats?.chartData?.map(d => d.revenue) || [],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#0ea5e9',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Sales", value: `₹${stats?.todaysSales?.toLocaleString() || 0}`, color: 'bg-blue-500' },
          { title: "Total Invoices", value: stats?.totalInvoices || 0, color: 'bg-green-500' },
          { title: "Low Stock Items", value: stats?.lowStockItems || 0, color: 'bg-red-500' },
          { title: "Expiring Soon", value: stats?.expiringSoon || 0, color: 'bg-yellow-500' },
        ].map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-full ${metric.color} bg-opacity-10 flex items-center justify-center`}>
              <div className={`w-4 h-4 rounded-full ${metric.color}`}></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview (Last 7 Days)</h3>
          <div className="flex-1 min-h-[300px]">
            <Line options={chartOptions} data={lineChartData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
          <div className="space-y-4 max-h-[350px] overflow-auto pr-2">
            {stats?.recentAlerts?.length > 0 ? (
              stats.recentAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-xl">
                  <div className="mt-1 font-bold">!</div>
                  <div>
                    <p className="font-medium line-clamp-1">{alert.name} Low Stock</p>
                    <p className="text-sm opacity-80">Only {alert.stockQuantity} remaining</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No low stock alerts. All good!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
