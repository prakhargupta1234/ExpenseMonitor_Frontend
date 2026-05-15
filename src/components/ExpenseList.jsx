import moment from "moment";
import {Download, Mail} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";

const SpendingsList = ({ transactions, onDelete, onDownload, onEmail }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Spendings</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="card-btn" onClick={onEmail}>
                        <Mail size={15} className="text-base" /> Email
                    </button>
                    <button className="card-btn" onClick={onDownload}>
                        <Download size={15} className="text-base" /> Download
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {transactions?.map((spending) => (
                    <TransactionInfoCard
                        key={spending.id}
                        title={spending.name}
                        icon={spending.icon}
                        date={moment(spending.date).format("Do MMM YYYY")}
                        amount={spending.amount}
                        type="spendings"
                        onDelete={() => onDelete(spending.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SpendingsList;
