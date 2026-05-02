import { useEffect, useState } from "react";
import { Plus, Coins, Download, Mail, LoaderCircle } from "lucide-react";
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

    const fetchExpenses = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE);
            setExpenses(response.data || []);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAddSuccess = () => {
        setShowAddModal(false);
        toast.success("Expense added successfully!");
        setLoading(true);
        fetchExpenses();
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
                responseType: 'blob', // Important for handling binary data
            });
            
            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expense_Report.xlsx'); // filename
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

    // Calculate total
    const totalExpense = expenses.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
        <div>
            <Dashboard activeMenu="Expense">
                <div className="my-5 mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-2xl font-semibold">Expenses</h2>
                            <p className="text-sm text-gray-500 mt-1">This month's expenses</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEmail}
                                disabled={isEmailing}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-200 ${isEmailing ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                {isEmailing ? <LoaderCircle size={16} className="animate-spin" /> : <Mail size={16} />}
                                {isEmailing ? 'Sending...' : 'Email'}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-200 ${isDownloading ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                {isDownloading ? <LoaderCircle size={16} className="animate-spin" /> : <Download size={16} />}
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                                <Plus size={16} />
                                Add Expense
                            </button>
                        </div>
                    </div>

                    {/* Chart */}
                    {!loading && expenses.length > 0 && <ExpenseChart expenses={expenses} />}

                    {/* Total Summary */}
                    {!loading && expenses.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Coins className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-red-700 font-medium">Total Expenses</p>
                                    <p className="text-xs text-red-600">
                                        {expenses.length} transaction{expenses.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xl font-bold text-red-700">
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
                        <div className="space-y-2">
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
            </Dashboard>

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
        </div>
    );
};

export default Expense;