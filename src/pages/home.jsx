import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import PageLoader from "../components/PageLoader";
import { Link } from "react-router-dom";

const COLORS_OVERVIEW = ["#7c26f0", "#ef4444", "#10b981"]; // Purple (Balance), Red (Expense), Green (Income)

const Home = () => {
    useUser();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
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

    const parseAmount = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return Number(String(val).replace(/[^\d.-]/g, '')) || 0;
    };

    const totalIncome = parseAmount(dashboardData?.totalIncome);
    const totalExpense = parseAmount(dashboardData?.totalExpense);
    const balance = dashboardData?.balance !== undefined && parseAmount(dashboardData?.balance) !== 0 
        ? parseAmount(dashboardData.balance) 
        : (totalIncome - totalExpense);

    const recentTransactions = dashboardData?.recentTransactions || [];
    
    // Filter incomes and expenses
    const recentIncomes = recentTransactions.filter(tx => tx.type?.toUpperCase() === "INCOME").slice(0, 5);
    const recentExpenses = recentTransactions.filter(tx => tx.type?.toUpperCase() === "EXPENSE").slice(0, 5);
    const generalRecent = recentTransactions.slice(0, 5);

    // Prepare Financial Overview Donut Data
    const overviewData = [];
    if (balance > 0) overviewData.push({ name: "Total Balance", value: balance, fill: "#7c26f0" });
    if (totalExpense > 0) overviewData.push({ name: "Total Expenses", value: totalExpense, fill: "#ef4444" });
    if (totalIncome > 0) overviewData.push({ name: "Total Income", value: totalIncome, fill: "#10b981" });
    
    if (overviewData.length === 0) {
        overviewData.push({ name: "No Data", value: 1, fill: "#e5e7eb" });
    }

    const formatCurrency = (val) => {
        return `₹${parseAmount(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    };

    // Reusable Transaction Item Renderer
    const renderTransactionItem = (tx, index) => {
        const isIncome = tx.type?.toUpperCase() === "INCOME";
        const displayName = tx.name || tx.description || tx.categoryName || "Transaction";
        const displayDate = tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Unknown Date";
        
        return (
            <div
                key={tx.id || index}
                className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 ${isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                        {(tx.icon || tx.categoryIcon) ? (
                            (tx.icon || tx.categoryIcon).startsWith('http') || (tx.icon || tx.categoryIcon).startsWith('data:') ? (
                                <img src={tx.icon || tx.categoryIcon} alt={displayName} className="w-5 h-5 object-contain" />
                            ) : (
                                <span>{tx.icon || tx.categoryIcon}</span>
                            )
                        ) : (
                            <span className="font-bold text-sm">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 capitalize truncate">
                            {displayName}
                        </p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {displayDate}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 text-right">
                    <p className={`font-bold text-sm ${isIncome ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"} px-2.5 py-1 rounded-md inline-block`}>
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                </div>
            </div>
        );
    };



    return (
        <Dashboard activeMenu="Dashboard">
            <div className="my-5 mx-auto max-w-[1400px]">
                
                {/* Top Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    {/* Total Balance */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#7c26f0] rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-purple-200">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
                        </div>
                    </div>

                    {/* Total Income */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#064e3b] rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-900/20">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
                        </div>
                    </div>

                    {/* Total Expense */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#7f1d1d] rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-red-900/20">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Expense</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpense)}</p>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Recent Transactions & Financial Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                    {/* Recent Transactions List */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                            <Link to="/filter" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                                More <ArrowRight size={14} />
                            </Link>
                        </div>
                        {generalRecent.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-10">No recent transactions</p>
                        ) : (
                            <div className="space-y-1">
                                {generalRecent.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>

                    {/* Financial Overview Donut Chart */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Financial Overview</h3>
                        <div className="flex-1 relative flex flex-col items-center justify-center min-h-[300px]">
                            {overviewData.length === 1 && overviewData[0].name === "No Data" ? (
                                <p className="text-gray-400 text-sm">No financial data available</p>
                            ) : (
                                <>
                                    {/* Center Text Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                        <p className="text-xs font-medium text-gray-500 mb-0.5">Total Balance</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
                                    </div>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={overviewData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}
                                                outerRadius={120}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {overviewData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => formatCurrency(value)} 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend 
                                                iconType="circle" 
                                                wrapperStyle={{ paddingTop: '10px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Recent Expenses & Recent Incomes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                    {/* Recent Expenses List */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Expenses</h3>
                            <Link to="/expense" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                                More <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentExpenses.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No recent expenses</p>
                        ) : (
                            <div className="space-y-1">
                                {recentExpenses.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>

                    {/* Recent Incomes List */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Incomes</h3>
                            <Link to="/income" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                                More <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentIncomes.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No recent incomes</p>
                        ) : (
                            <div className="space-y-1">
                                {recentIncomes.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default Home;