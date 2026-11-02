import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import PageLoader from "../components/PageLoader";
import { Link } from "react-router-dom";

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
            <Dashboard activeMenu="Overview">
                <PageLoader />
            </Dashboard>
        );
    }

    if (error) {
        return (
            <Dashboard activeMenu="Overview">
                <div className="text-red-500 text-center py-12">{error}</div>
            </Dashboard>
        );
    }

    const parseAmount = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        return Number(String(val).replace(/[^\d.-]/g, '')) || 0;
    };

    const totalEarnings = parseAmount(dashboardData?.totalIncome);
    const totalSpendings = parseAmount(dashboardData?.totalExpense);
    const balance = dashboardData?.balance !== undefined && parseAmount(dashboardData?.balance) !== 0 
        ? parseAmount(dashboardData.balance) 
        : (totalEarnings - totalSpendings);

    const recentTransactions = dashboardData?.recentTransactions || [];
    
    const recentEarnings = recentTransactions.filter(tx => tx.type?.toUpperCase() === "INCOME" || tx.type?.toUpperCase() === "EARNINGS").slice(0, 5);
    const recentSpendings = recentTransactions.filter(tx => tx.type?.toUpperCase() === "EXPENSE" || tx.type?.toUpperCase() === "SPENDINGS").slice(0, 5);
    const generalRecent = recentTransactions.slice(0, 5);

    const overviewData = [];
    if (balance > 0) overviewData.push({ name: "Balance", value: balance, fill: "#059669" });
    if (totalSpendings > 0) overviewData.push({ name: "Spendings", value: totalSpendings, fill: "#ef4444" });
    if (totalEarnings > 0) overviewData.push({ name: "Earnings", value: totalEarnings, fill: "#10b981" });
    
    if (overviewData.length === 0) {
        overviewData.push({ name: "No Data", value: 1, fill: "#e5e7eb" });
    }

    const formatCurrency = (val) => {
        return `₹${parseAmount(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    };

    const renderTransactionItem = (tx, index) => {
        const isIncome = tx.type?.toUpperCase() === "INCOME" || tx.type?.toUpperCase() === "EARNINGS";
        const displayName = tx.name || tx.description || tx.categoryName || "Transaction";
        const displayDate = tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Unknown Date";
        
        return (
            <div
                key={tx.id || index}
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
            >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-all duration-200 ${isIncome ? "bg-emerald-50 group-hover:bg-emerald-100" : "bg-red-50 group-hover:bg-red-100"}`}>
                        {(tx.icon || tx.categoryIcon) ? (
                            (tx.icon || tx.categoryIcon).startsWith('http') || (tx.icon || tx.categoryIcon).startsWith('data:') ? (
                                <img src={tx.icon || tx.categoryIcon} alt={displayName} className="w-4 h-4 object-contain" />
                            ) : (
                                <span>{tx.icon || tx.categoryIcon}</span>
                            )
                        ) : (
                            <span className={`font-bold text-xs ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm text-gray-900 capitalize truncate">
                            {displayName}
                        </p>
                        <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">
                            {displayDate}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 text-right ml-2">
                    <span className={`font-bold text-xs sm:text-sm px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${isIncome ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                        {isIncome ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Dashboard activeMenu="Overview">
            <div>
                {/* Hero Section */}
                <div className="bg-emerald-600 rounded-2xl p-5 sm:p-6 mb-5 text-white shadow-md relative overflow-hidden animate-scale-in">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-10 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold mb-1.5 leading-tight">
                            Take Control of Your Financial Life
                        </h1>
                        <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
                            Track spendings, monitor earnings, analyze spending habits, and manage your finances smarter with <strong className="text-white">ExpenseIQ</strong>.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 mb-5 stagger-children">
                    {/* Total Balance */}
                    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                                    <Wallet className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Net Worth</span>
                            </div>
                            <p className="text-emerald-100/60 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Total Balance</p>
                            <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{formatCurrency(balance)}</p>
                        </div>
                    </div>

                    {/* Total Earnings */}
                    <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-emerald-700/60 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Total Earnings</p>
                            <p className="text-xl sm:text-2xl font-bold text-emerald-900 tracking-tight">{formatCurrency(totalEarnings)}</p>
                            <div className="mt-2 flex items-center gap-1 text-[10.5px] font-bold text-emerald-600">
                                <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></div>
                                Cumulative earnings
                            </div>
                        </div>
                    </div>

                    {/* Total Spendings */}
                    <div className="bg-red-50/80 border border-red-100 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-200/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-xs">
                                    <TrendingDown className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-red-700/60 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Total Spendings</p>
                            <p className="text-xl sm:text-2xl font-bold text-red-900 tracking-tight">{formatCurrency(totalSpendings)}</p>
                            <div className="mt-2 flex items-center gap-1 text-[10.5px] font-bold text-red-600">
                                <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse"></div>
                                Total spending
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 mb-5">
                    {/* Recent Transactions */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs animate-fade-in flex flex-col">
                        <div className="flex justify-between items-center mb-3.5">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Recent Transactions</h3>
                            <Link to="/filter" className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold transition-all">
                                More <ArrowRight size={12} />
                            </Link>
                        </div>
                        {generalRecent.length === 0 ? (
                            <p className="text-gray-400 text-xs sm:text-sm text-center py-8">No recent transactions</p>
                        ) : (
                            <div className="space-y-0.5 divide-y divide-gray-50">
                                {generalRecent.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col animate-fade-in group">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Financial Overview</h3>
                            <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
                                <TrendingUp size={14} className="text-emerald-600" />
                            </div>
                        </div>
                        <div className="flex-1 relative flex flex-col items-center justify-center min-h-[250px]">
                            {overviewData.length === 1 && overviewData[0].name === "No Data" ? (
                                <p className="text-gray-400 text-xs sm:text-sm">No financial data available</p>
                            ) : (
                                <>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Balance</p>
                                        <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatCurrency(balance)}</p>
                                    </div>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={overviewData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={95}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                                activeShape={{ stroke: 'none', fillOpacity: 0.8 }}
                                                isAnimationActive={true}
                                                animationDuration={800}
                                            >
                                                {overviewData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.fill} 
                                                        style={{ outline: 'none' }}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [formatCurrency(value), ""]} 
                                                contentStyle={{ 
                                                    borderRadius: '12px', 
                                                    border: 'none', 
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                    padding: '8px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    color: '#1e293b'
                                                }}
                                                itemStyle={{ color: '#1e293b' }}
                                                cursor={{ fill: 'transparent' }}
                                            />
                                            <Legend 
                                                iconType="circle" 
                                                wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontWeight: '600' }}
                                                verticalAlign="bottom"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 mb-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs animate-fade-in">
                        <div className="flex justify-between items-center mb-3.5">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Recent Spendings</h3>
                            <Link to="/expense" className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold transition-all">
                                More <ArrowRight size={12} />
                            </Link>
                        </div>
                        {recentSpendings.length === 0 ? (
                            <p className="text-gray-400 text-xs sm:text-sm text-center py-6">No recent spendings</p>
                        ) : (
                            <div className="space-y-0.5 divide-y divide-gray-50">
                                {recentSpendings.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs animate-fade-in">
                        <div className="flex justify-between items-center mb-3.5">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">Recent Earnings</h3>
                            <Link to="/income" className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold transition-all">
                                More <ArrowRight size={12} />
                            </Link>
                        </div>
                        {recentEarnings.length === 0 ? (
                            <p className="text-gray-400 text-xs sm:text-sm text-center py-6">No recent earnings</p>
                        ) : (
                            <div className="space-y-0.5 divide-y divide-gray-50">
                                {recentEarnings.map((tx, index) => renderTransactionItem(tx, index))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default Home;
