import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import PageLoader from "../components/PageLoader";

const COLORS_INCOME = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#059669", "#047857"];
const COLORS_EXPENSE = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#dc2626", "#b91c1c"];

const Home = () => {
    useUser();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD);
                setDashboardData(response.data);
            } catch (err) {
                setError("Failed to fetch dashboard data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <Dashboard activeMenu="Dashboard">
                <PageLoader />
            </Dashboard>
        );
    }

    if (error) {
        return (
            <Dashboard activeMenu="Dashboard">
                <div className="text-red-500 text-center py-12">{error}</div>
            </Dashboard>
        );
    }

    const totalIncome = dashboardData?.totalIncome || 0;
    const totalExpense = dashboardData?.totalExpense || 0;
    const balance = dashboardData?.balance || 0;

    // Prepare pie chart data
    const incomeByCategory = dashboardData?.incomeByCategory || {};
    const expenseByCategory = dashboardData?.expenseByCategory || {};

    const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({
        name,
        value: Number(value)
    }));

    const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value: Number(value)
    }));

    const recentTransactions = dashboardData?.recentTransactions || [];

    const formatCurrency = (val) => {
        return `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    };

    return (
        <Dashboard activeMenu="Dashboard">
            <div className="my-5 mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {/* Total Income */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500">Total Income</span>
                            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
                        <p className="text-xs text-gray-400 mt-1">This month</p>
                    </div>

                    {/* Total Expense */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500">Total Expense</span>
                            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpense)}</p>
                        <p className="text-xs text-gray-400 mt-1">This month</p>
                    </div>

                    {/* Balance */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-500">Balance</span>
                            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(balance)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Net this month</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                    {/* Income by Category */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
                        {incomePieData.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-10">No income data for this month</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={incomePieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {incomePieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Expense by Category */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense by Category</h3>
                        {expensePieData.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-10">No expense data for this month</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={expensePieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {expensePieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No recent transactions</p>
                    ) : (
                        <div className="space-y-2">
                            {recentTransactions.map((tx, index) => (
                                <div
                                    key={tx.id || index}
                                    className={`flex justify-between items-center p-3.5 rounded-lg ${
                                        tx.type === "INCOME" ? "bg-green-50/60" : "bg-red-50/60"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                            tx.type === "INCOME" ? "bg-green-100" : "bg-red-100"
                                        }`}>
                                            {tx.type === "INCOME" ? "💰" : "💸"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">
                                                {tx.description || tx.categoryName || "Transaction"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-semibold text-sm ${
                                        tx.type === "INCOME" ? "text-green-600" : "text-red-600"
                                    }`}>
                                        {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Dashboard>
    );
};

export default Home;