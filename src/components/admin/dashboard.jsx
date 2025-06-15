import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { FaMoneyBill, FaRupeeSign } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../redux/slice/productSlice";
import { useAdminAuth } from "../../context/Admin";
import { toast } from "react-toastify";
import api from "../../config/api";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  const { admin } = useAdminAuth();

  console.log(admin);

  // Redux State

  // Local state for refreshing manually
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [refresh]); // Refresh dependency added
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/admin/orders');
        console.log(response.data.data);
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [refresh]);


  console.log(orders);

  const totalOrders = orders.length;
  const deliveredOrders = orders.length;
  const completionRate =
    totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.price || 0),
    0
  );
  const profitMargin = 65;

  const orderData = [
    { name: "Completed", value: deliveredOrders, color: "#FF8042" },
    { name: "Pending", value: totalOrders - deliveredOrders, color: "#FFBB28" },
  ];

  const revenueData = [
    { name: "Profit", value: profitMargin, color: "#FF8042" },
    { name: "Cost", value: 100 - profitMargin, color: "#FFBB28" },
  ];

  const growthData = [
    { name: "Growth", value: 82, color: "#FF8042" },
    { name: "Target", value: 18, color: "#FFBB28" },
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center w-full justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
          <p className="text-primary text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="mt-2 flex flex-col justify-center ">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-mutedPrimary">Hi {admin?.name}</p>
            <p className="text-sm text-mutedPrimary">{admin?.email}</p>

            <p className="text-mutedPrimary">
              Welcome back to Zang Global Admin!
            </p>
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-mutedPrimary transition flex items-center"
            onClick={(e) => {
              setRefresh(!refresh);
            }}
          >
            <TrendingUp className="mr-2 h-5 w-5" /> Refresh Data
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              icon: <ShoppingCart className="text-primary" />,
              title: "Total Orders",
              value: totalOrders,
              change: 12,
            },
            {
              icon: <CheckCircle className="text-primary" />,
              title: "Orders Delivered",
              value: deliveredOrders,
              change: 100,
            },
            {
              icon: <FaMoneyBill className="text-primary" />,
              title: "Revenue Generated",
              value: `₦${totalRevenue.toLocaleString()}`,
              change: 15,
            },
            {
              icon: <Package className="text-primary" />,
              title: "Total Products",
              value: products?.length || 0,
              change: 5,
            },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-b-4 border-primary"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="bg-pink-50 p-3 rounded-full">{metric.icon}</div>
                <span
                  className={`text-sm font-medium ${
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ↑ {metric.change}%
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mb-2">{metric.title}</h3>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Order Status",
              data: orderData,
              percentage: completionRate,
              description: "Completion Rate",
            },
            {
              title: "Revenue Analytics",
              data: revenueData,
              percentage: profitMargin,
              description: "Profit Margin",
            },
            {
              title: "Customer Growth",
              data: growthData,
              percentage: 82,
              description: "Growth Rate",
            },
          ].map((chart, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-2 border-t-4 border-primary"
            >
              <h2 className="text-lg font-semibold text-pink-700 mb-4">
                {chart.title}
              </h2>
              <div className="h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <p className="text-3xl font-bold">{chart.percentage}%</p>
                <p className="text-primary">{chart.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
