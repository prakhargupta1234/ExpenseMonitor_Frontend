import { useEffect, useState } from "react";
import { Plus, Wallet, Mail, Download, TrendingUp, Trash2, LoaderCircle } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import toast from "react-hot-toast";
import Modal from "../components/modal";
import TransactionForm from "../components/TransactionForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import PageLoader from "../components/PageLoader";
import IncomeChart from "../components/IncomeChart";

const Income = () => {
    useUser();

    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);
    const fetchIncomes = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            const data = response.data || [];

            // Safely filter and normalize type to catch 'INCOME', 'income', etc.
            const validIncomes = data.filter((item) => {
                const itemType = item?.type || item?.category?.type || item?.categoryType;
                if (!itemType || typeof itemType !== 'string') return true; // Include items without a strict type to prevent hiding valid data
                return itemType.toLowerCase() === 'income';
            });

            // Debugging log for development
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Income Page] Fetched ${data.length} total items, filtered down to ${validIncomes.length} valid incomes.`);
                console.log(`[Income Page] Filtered Payload:`, validIncomes);
            }

            setIncomes(validIncomes);
        } catch (error) {
            console.error("Failed to fetch incomes:", error);
            toast.error("Failed to load incomes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleAddSuccess = () => {
        setShowAddModal(false);
        toast.success("Income added successfully!");
        setLoading(true);
        fetchIncomes();
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {
                responseType: 'blob', // Important for handling binary data
            });
            
            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Income_Report.xlsx'); // filename
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
            await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            toast.success("Income report emailed successfully!");
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
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(deleteId));
            toast.success("Income deleted successfully!");
            setDeleteId(null);
            fetchIncomes();
        } catch (error) {
            console.error("Failed to delete income:", error);
            toast.error("Failed to delete income");
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div>
            <Dashboard activeMenu="Income">
                <div className="my-5 mx-auto">
                    {/* Header with Add Button */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Income Overview</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage and track your income sources</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-[#7c26f0] text-white px-5 py-2.5 rounded-lg hover:bg-[#6819d4] transition-colors duration-200 text-sm font-medium shadow-sm"
                        >
                            <Plus size={18} />
                            Add Income
                        </button>
                    </div>

                    {/* Main Content */}
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
                        <>
                            <IncomeChart incomes={incomes} />
                            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8">
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                    <h3 className="text-xl font-bold text-gray-900">Income Sources</h3>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={handleEmail}
                                            disabled={isEmailing}
                                            className={`flex items-center gap-2 px-4 py-2 border border-gray-100 text-sm font-semibold rounded-xl transition-all ${isEmailing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {isEmailing ? <LoaderCircle size={16} className="text-gray-400 animate-spin" /> : <Mail size={16} className="text-gray-500" />} 
                                            {isEmailing ? 'Sending...' : 'Email'}
                                        </button>
                                        <button 
                                            onClick={handleDownload}
                                            disabled={isDownloading}
                                            className={`flex items-center gap-2 px-4 py-2 border border-gray-100 text-sm font-semibold rounded-xl transition-all ${isDownloading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {isDownloading ? <LoaderCircle size={16} className="text-gray-400 animate-spin" /> : <Download size={16} className="text-gray-500" />} 
                                            {isDownloading ? 'Downloading...' : 'Download'}
                                        </button>
                                    </div>
                                </div>

                                {/* Income List */}
                                <div className="space-y-3">
                                    {incomes.map((income) => (
                                        <div
                                            key={income.id}
                                            className="group flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-5 flex-1 min-w-0">
                                                {/* Icon */}
                                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#f3edfd] flex items-center justify-center">
                                                    {(income.icon || income.categoryIcon) ? (
                                                        (income.icon || income.categoryIcon).startsWith('http') || (income.icon || income.categoryIcon).startsWith('data:') ? (
                                                            <img src={income.icon || income.categoryIcon} alt="icon" className="w-7 h-7 object-contain" />
                                                        ) : (
                                                            <span className="text-3xl leading-none">{income.icon || income.categoryIcon}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-500 font-bold text-lg">
                                                            {(income.name || income.categoryName || "I").charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-gray-900 text-base truncate capitalize">
                                                        {income.name || "Income Source"}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {income.categoryName && (
                                                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md capitalize">
                                                                {income.categoryName}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-medium text-gray-400 truncate">
                                                            {formatDate(income.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Amount & Actions */}
                                            <div className="flex items-center gap-4 shrink-0 ml-4">
                                                <div className="flex items-center gap-2 bg-[#ecfdf3] text-[#027a48] px-4 py-2 rounded-xl">
                                                    <span className="text-base font-bold tracking-tight">
                                                        +₹{Number(income.amount).toLocaleString("en-IN")}
                                                    </span>
                                                    <TrendingUp size={16} strokeWidth={2.5} />
                                                </div>

                                                <button
                                                    onClick={() => setDeleteId(income.id)}
                                                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                    title="Delete Income"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Dashboard>

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
                itemName="Income Source"
            />
        </div>
    );
};

export default Income;