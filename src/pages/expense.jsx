import { useEffect, useState, useCallback } from "react";
import { Plus, Coins, Download, Mail, LoaderCircle, TrendingDown, History, LayoutGrid } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import TransactionCard from "../components/TransactionCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import PageLoader from "../components/PageLoader";
import SpendingsChart from "../components/ExpenseChart";
import InfoCard from "../components/InfoCard";

const Expense = () => {
    useUser();

    const [spendings, setSpendings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);

    const fetchSpendings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_SPENDINGS);
            setSpendings(response.data || []);
        } catch (error) {
            console.error("Failed to fetch spendings:", error);
            toast.error("Failed to load spendings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpendings();
    }, [fetchSpendings]);

    const handleAddSuccess = () => {
        setShowAddModal(false);
        toast.success("Spending added successfully!");
        fetchSpendings();
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.SPENDINGS_EXCEL_DOWNLOAD, {
                responseType: 'blob',
            });
            
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Spendings_Report.xlsx');
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
            await axiosConfig.get(API_ENDPOINTS.EMAIL_SPENDINGS);
            toast.success("Spending report emailed successfully!");
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
            await axiosConfig.delete(API_ENDPOINTS.DELETE_SPENDING(deleteId));
            toast.success("Spending deleted successfully!");
            setDeleteId(null);
            fetchSpendings();
        } catch (error) {
            console.error("Failed to delete spending:", error);
            toast.error("Failed to delete spending");
        } finally {
            setIsDeleting(false);
        }
    };

    const totalSpendings = spendings.reduce((sum, item) => {
        const amount = typeof item.amount === 'string' 
            ? Number(item.amount.replace(/[^\d.-]/g, '')) 
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalTransactions = spendings.length;
    const uniqueCategoriesCount = new Set(spendings.filter(item => item.categoryName).map(item => item.categoryName)).size;

    return (
        <Dashboard activeMenu="Spendings">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Spendings</h2>
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
                            Add Spending
                        </button>
                    </div>
                </div>

                {/* Chart */}
                {!loading && spendings.length > 0 && <SpendingsChart spendings={spendings} />}

                {/* Cards Summary */}
                {!loading && spendings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
                        <div>
                            <InfoCard
                                icon={<TrendingDown size={24} />}
                                label="Total Spendings"
                                value={`₹${totalSpendings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                color="bg-red-500"
                            />
                        </div>
                        <div style={{ animationDelay: "0.1s" }}>
                            <InfoCard
                                icon={<History size={24} />}
                                label="Total Transactions"
                                value={totalTransactions}
                                color="bg-orange-500"
                            />
                        </div>
                        <div style={{ animationDelay: "0.2s" }}>
                            <InfoCard
                                icon={<LayoutGrid size={24} />}
                                label="Categories Used"
                                value={uniqueCategoriesCount}
                                color="bg-rose-500"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <PageLoader />
                ) : spendings.length === 0 ? (
                    <EmptyState
                        icon={Coins}
                        title="No spendings recorded"
                        description="Start tracking your spendings by adding your first entry."
                        actionLabel="Add Spending"
                        onAction={() => setShowAddModal(true)}
                    />
                ) : (
                    <div className="space-y-3 stagger-children">
                        {spendings.map((spending) => (
                            <div key={spending.id}>
                                <TransactionCard
                                    transaction={spending}
                                    type="spendings"
                                    onDelete={handleDeleteClick}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Spending Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Spending"
            >
                <TransactionForm
                    type="spendings"
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
                itemName="Spending"
            />
        </Dashboard>
    );
};

export default Expense;