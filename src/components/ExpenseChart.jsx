import { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import moment from 'moment';
import { TrendingDown, Calendar, ArrowDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3.5 border border-red-100 shadow-xl rounded-2xl min-w-[150px] animate-in">
                <div className="flex items-center gap-2 mb-2.5">
                    <Calendar size={12} className="text-red-400" />
                    <p className="font-bold text-gray-800 text-sm">{label}</p>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Total</span>
                    <span className="text-sm font-bold text-red-600">
                        ₹{data.amount.toLocaleString("en-IN")}
                    </span>
                </div>
                {data.details && data.details.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 space-y-1">
                        {data.details.slice(0, 4).map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-gray-600">
                                <span className="truncate max-w-[90px] text-gray-500">{detail.name}</span>
                                <span className="font-semibold ml-2">₹{detail.amount.toLocaleString("en-IN")}</span>
                            </div>
                        ))}
                        {data.details.length > 4 && (
                            <p className="text-[10px] text-gray-400 pt-1">+{data.details.length - 4} more</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const SpendingsChart = ({ spendings }) => {
    const chartData = useMemo(() => {
        if (!spendings || spendings.length === 0) return [];
        const aggregated = spendings.reduce((acc, current) => {
            const dateStr = moment(current.date).format("Do MMM");
            if (!acc[dateStr]) {
                acc[dateStr] = { date: dateStr, rawDate: new Date(current.date), amount: 0, details: [] };
            }
            const currentAmount = Number(current.amount) || 0;
            acc[dateStr].amount += currentAmount;
            acc[dateStr].details.push({ name: current.name || current.categoryName || "Spending", amount: currentAmount });
            return acc;
        }, {});
        return Object.values(aggregated).sort((a, b) => a.rawDate - b.rawDate);
    }, [spendings]);

    const totalAmount = useMemo(() => chartData.reduce((s, d) => s + d.amount, 0), [chartData]);
    const avgAmount = chartData.length > 0 ? totalAmount / chartData.length : 0;
    const peakDay = chartData.reduce((best, d) => d.amount > (best?.amount || 0) ? d : best, null);

    if (chartData.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <TrendingDown size={20} className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Spendings Overview</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Daily trend across {chartData.length} day{chartData.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                {/* Mini KPI Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <ArrowDown size={11} />
                        Avg: ₹{avgAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                    {peakDay && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                            <Calendar size={11} />
                            Peak: {peakDay.date}
                        </span>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[240px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="spendingsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                        />
                        <ReferenceLine
                            y={avgAmount}
                            stroke="#fee2e2"
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Area
                            type="monotoneX"
                            dataKey="amount"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#spendingsGrad)"
                            activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 3, filter: 'drop-shadow(0 2px 6px rgba(239,68,68,0.5))' }}
                            dot={chartData.length <= 8 ? { r: 3, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 } : false}
                            isAnimationActive={true}
                            animationDuration={900}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingsChart;
