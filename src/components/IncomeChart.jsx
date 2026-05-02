import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import moment from 'moment';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl min-w-[120px]">
                <p className="font-bold text-gray-900 mb-2">{label}</p>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Total: </span>
                    <span className="text-sm font-bold text-[#7c26f0]">
                        ₹{data.amount.toLocaleString("en-IN")}
                    </span>
                </div>
                {data.details && data.details.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Details:</p>
                        {data.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-gray-600 mb-1">
                                <span className="truncate max-w-[80px]">{detail.name}:</span>
                                <span>₹{detail.amount.toLocaleString("en-IN")}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const IncomeChart = ({ incomes }) => {
    const chartData = useMemo(() => {
        if (!incomes || incomes.length === 0) return [];

        // Aggregate incomes by date
        const aggregated = incomes.reduce((acc, current) => {
            // Format date to "6th Jul"
            const dateStr = moment(current.date).format("Do MMM");
            
            if (!acc[dateStr]) {
                acc[dateStr] = {
                    date: dateStr,
                    rawDate: new Date(current.date),
                    amount: 0,
                    details: []
                };
            }
            
            const currentAmount = Number(current.amount) || 0;
            acc[dateStr].amount += currentAmount;
            
            acc[dateStr].details.push({
                name: current.name || current.categoryName || "Income",
                amount: currentAmount
            });
            
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.values(aggregated).sort((a, b) => a.rawDate - b.rawDate);
    }, [incomes]);

    if (chartData.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 mb-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Income Overview</h3>
                <p className="text-sm text-gray-500 mt-1">Track your earnings over time and analyze your income trends.</p>
            </div>
            
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c26f0" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7c26f0" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#7c26f0" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                            activeDot={{ r: 6, fill: '#7c26f0', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeChart;
