import { useEffect, useState } from "react";
import {Plus} from "lucide-react";
import CustomLineChart from "./CustomLineChart.jsx";
import {prepareEarningsLineChartData} from "../util/util.js";

const SpendingsOverview = ({transactions, onAddSpendings}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareEarningsLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Spendings Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spending trends over time and gain insights into where
                        your money goes.
                    </p>
                </div>

                <button className="add-btn" onClick={onAddSpendings}>
                    <Plus size={15} className="text-lg" />
                    Add Spending
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default SpendingsOverview;
