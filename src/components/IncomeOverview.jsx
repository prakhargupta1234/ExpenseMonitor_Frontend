import {useEffect, useState} from "react";
import {prepareEarningsLineChartData} from "../util/util.js";
import CustomLineChart from "./CustomLineChart.jsx";
import {Plus} from "lucide-react";

const EarningsOverview = ({transactions, onAddEarnings}) => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const result = prepareEarningsLineChartData(transactions);
        console.log(result);
        setChartData(result);

        return () => {};
    }, [transactions]);
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg">
                        Earnings Overview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0 5">
                        Track your earnings over time and analyze your earnings trends.
                    </p>
                </div>
                <button className="add-btn" onClick={onAddEarnings}>
                    <Plus size={15} className="text-lg" /> Add Earning
                </button>
            </div>
            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default EarningsOverview;