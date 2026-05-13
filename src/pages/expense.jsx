import { useEffect, useState, useCallback } from "react";
import { Plus, Coins, Download, Mail, LoaderCircle, TrendingDown } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../components/modal";
import TransactionForm from "../components/TransactionForm";
import TransactionCard from "../components/TransactionCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import PageLoader from "../components/PageLoader";
import ExpenseChart from "../components/ExpenseChart";

const Expense = () => {
    useUser();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE);
            setExpenses(response.data || []);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAddSuccess = () => {
        setShowAddModal(false);
        toast.success("Expense added successfully!");
        fetchExpenses();
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
                responseType: 'blob',
            });
            
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expense_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success("Excel file downloaded successfully!");
        } catch (error) {
            console.error("Failed to download excel:", error);
            toast.error("Failed to download Excel file");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleEmail = async () => {
        setIsEmailing(true);
        try {
            await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            toast.success("Expense report emailed successfully!");
        } catch (error) {
            console.error("Failed to email report:", error);
            toast.error("Failed to send email");
        } finally {
            setIsEmailing(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(deleteId));
            toast.success("Expense deleted successfully!");
            setDeleteId(null);
            fetchExpenses();
        } catch (error) {
            console.error("Failed to delete expense:", error);
            toast.error("Failed to delete expense");
        } finally {
            setIsDeleting(false);
        }
    };

    const totalExpense = expenses.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <Dashboard activeMenu="Expense">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your monthly spending</p>
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
                            className="flex items-center gap-1.5 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-bold shadow-lg shadow-red-100 active:scale-95"
                        >
                            <Plus size={18} />
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Chart */}
                {!loading && expenses.length > 0 && <ExpenseChart expenses={expenses} />}

                {/* Total Summary */}
                {!loading && expenses.length > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Total Expenses</p>
                                <p className="text-[11px] text-red-600 font-medium">
                                    {expenses.length} transaction{expenses.length !== 1 ? "s" : ""} recorded
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-red-700">
                            -₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <PageLoader />
                ) : expenses.length === 0 ? (
                    <EmptyState
                        icon={Coins}
                        title="No expenses recorded"
                        description="Start tracking your expenses by adding your first entry."
                        actionLabel="Add Expense"
                        onAction={() => setShowAddModal(true)}
                    />
                ) : (
                    <div className="space-y-3">
                        {expenses.map((expense) => (
                            <TransactionCard
                                key={expense.id}
                                transaction={expense}
                                type="expense"
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Expense Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Expense"
            >
                <TransactionForm
                    type="expense"
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
                itemName="Expense"
            />
        </Dashboard>
    );
};

export default Expense;