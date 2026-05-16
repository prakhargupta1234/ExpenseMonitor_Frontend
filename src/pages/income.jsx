import { useEffect, useState, useCallback } from "react";
import Dashboard from "../components/Dashboard";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import { Plus, Wallet, Mail, Download, LoaderCircle } from "lucide-react";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import TransactionCard from "../components/TransactionCard";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EarningsChart from "../components/IncomeChart";
import InfoCard from "../components/InfoCard";
import toast from "react-hot-toast";
import { ArrowUpCircle, History, LayoutGrid, TrendingUp } from "lucide-react";

const Income = () => {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [categories, setCategories] = useState([]);

    const fetchEarnings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EARNINGS);
            setEarnings(response.data || []);
        } catch (err) {
            console.error("Failed to fetch earnings:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await axiosConfig.delete(`${API_ENDPOINTS.ADD_EARNING}/${deleteId}`);
            setEarnings(earnings.filter(item => item.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete earning:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        fetchEarnings();
    };

    const handleEmail = async () => {
        setIsEmailing(true);
        try {
            await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_EARNINGS}/download/email`);
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
            const response = await axiosConfig.get(`${API_ENDPOINTS.GET_ALL_EARNINGS}/download/excel`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Earnings_Report.xlsx');
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

    const totalEarnings = earnings.reduce((sum, item) => {
        const amount = typeof item.amount === 'string'
            ? Number(item.amount.replace(/[^\d.-]/g, ''))
            : Number(item.amount);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalTransactions = earnings.length;
    const uniqueCategoriesCount = new Set(earnings.filter(item => item.categoryName).map(item => item.categoryName)).size;

    return (
        <Dashboard activeMenu="Earnings">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your earnings sources</p>
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
                            Add Earning
                        </button>
                    </div>
                </div>

                {/* Chart */}
                {!loading && earnings.length > 0 && <EarningsChart earnings={earnings} />}

                {/* Cards Summary */}
                {!loading && earnings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
                        <div>
                            <InfoCard
                                icon={<TrendingUp size={24} />}
                                label="Total Earnings"
                                value={`₹${totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                color="bg-emerald-500"
                            />
                        </div>
                        <div style={{ animationDelay: "0.1s" }}>
                            <InfoCard
                                icon={<History size={24} />}
                                label="Total Transactions"
                                value={totalTransactions}
                                color="bg-teal-500"
                            />
                        </div>
                        <div style={{ animationDelay: "0.2s" }}>
                            <InfoCard
                                icon={<LayoutGrid size={24} />}
                                label="Categories Used"
                                value={uniqueCategoriesCount}
                                color="bg-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <PageLoader />
                ) : earnings.length === 0 ? (
                    <EmptyState
                        icon={Wallet}
                        title="No earnings recorded"
                        description="Start tracking your earnings by adding your first entry."
                        actionLabel="Add Earning"
                        onAction={() => setShowAddModal(true)}
                    />
                ) : (
                    <div className="space-y-3 stagger-children">
                        {earnings.map((earning) => (
                            <div key={earning.id}>
                                <TransactionCard
                                    transaction={earning}
                                    type="earnings"
                                    onDelete={handleDeleteClick}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Earning Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Earning"
            >
                <TransactionForm
                    type="earnings"
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
                itemName="Earnings"
            />
        </Dashboard>
    );
};

export default Income;