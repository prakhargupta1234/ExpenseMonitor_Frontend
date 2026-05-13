import { useEffect, useState, useCallback } from "react";
import Dashboard from "../components/dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { Plus, Wallet, Mail, Download, LoaderCircle, TrendingUp } from "lucide-react";
import Modal from "../components/modal";
import TransactionForm from "../components/TransactionForm";
import TransactionCard from "../components/TransactionCard";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import IncomeChart from "../components/IncomeChart";

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchIncomes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            setIncomes(response.data || []);
        } catch (err) {
            console.error("Failed to fetch incomes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncomes();
    }, [fetchIncomes]);

    const handleAddSuccess = () => {
        setShowAddModal(false);
        fetchIncomes();
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await axiosConfig.delete(`${API_ENDPOINTS.ADD_INCOME}/${deleteId}`);
            setIncomes(incomes.filter(item => item.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete income:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEmail = async () => {
        setIsEmailing(true);
        try {
            await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_INCOMES}/download/email`);
            alert("Report sent to your email!");
        } catch (err) {
            console.error("Email failed:", err);
            alert("Failed to send email.");
        } finally {
            setIsEmailing(false);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_INCOMES}/download/excel`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Income_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download report.");
        } finally {
            setIsDownloading(false);
        }
    };

    const totalIncome = incomes.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <Dashboard activeMenu="Earnings">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Income</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your income sources</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleEmail}
                            disabled={isEmailing}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border border-gray-200 shadow-sm ${isEmailing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-emerald-200 active:scale-95'}`}
                        >
                            {isEmailing ? <LoaderCircle size={16} className="animate-spin" /> : <Mail size={16} />}
                            {isEmailing ? 'Sending...' : 'Email'}
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border border-gray-200 shadow-sm ${isDownloading ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-emerald-200 active:scale-95'}`}
                        >
                            {isDownloading ? <LoaderCircle size={16} className="animate-spin" /> : <Download size={16} />}
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all duration-300 text-sm font-bold shadow-lg shadow-emerald-100 active:scale-95"
                        >
                            <Plus size={18} />
                            Add Income
                        </button>
                    </div>
                </div>

                {/* Chart */}
                {!loading && incomes.length > 0 && <IncomeChart incomes={incomes} />}

                {/* Total Summary */}
                {!loading && incomes.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Total Income</p>
                                <p className="text-[11px] text-emerald-600 font-medium">
                                    {incomes.length} source{incomes.length !== 1 ? "s" : ""} recorded
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">
                            +₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <PageLoader />
                ) : incomes.length === 0 ? (
                    <EmptyState
                        icon={Wallet}
                        title="No income recorded"
                        description="Start tracking your income by adding your first entry."
                        actionLabel="Add Income"
                        onAction={() => setShowAddModal(true)}
                    />
                ) : (
                    <div className="space-y-3">
                        {incomes.map((income) => (
                            <TransactionCard
                                key={income.id}
                                transaction={income}
                                type="income"
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Income Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Income"
            >
                <TransactionForm
                    type="income"
                    onSuccess={handleAddSuccess}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* Delete Confirmation */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                itemName="Income"
            />
        </Dashboard>
    );
};

export default Income;