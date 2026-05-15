import { useState, useEffect } from "react";
import { LoaderCircle, Image, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";

const TransactionForm = ({ type, onSuccess, onCancel }) => {
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [icon, setIcon] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [error, setError] = useState("");

    const isIncome = type === "earnings" || type === "income";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
                const allCategories = response.data || [];
                
                // Filter categories based on type
                const targetType = isIncome ? "income" : "expense";
                const filtered = allCategories.filter(cat => 
                    cat.type?.toLowerCase() === targetType || 
                    (isIncome && cat.type?.toLowerCase() === "earnings") || 
                    (!isIncome && cat.type?.toLowerCase() === "spendings")
                );
                
                setCategories(filtered);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setCategories([]);
            } finally {
                setIsFetchingCategories(false);
            }
        };
        fetchCategories();
    }, [isIncome]);

    const onEmojiClick = (emojiObject) => {
        setIcon(emojiObject.imageUrl || emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!description.trim()) {
            setError(`Please enter a valid ${isIncome ? "earning" : "spending"} source`);
            return;
        }
        if (!categoryId) {
            setError("Please select a category");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }
        if (!date) {
            setError("Please select a date");
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = isIncome ? API_ENDPOINTS.ADD_EARNING : API_ENDPOINTS.ADD_SPENDING;
            const payload = {
                amount: Number(amount),
                date,
                name: description.trim(),
                categoryId: Number(categoryId),
                ...(icon && { icon })
            };

            await axiosConfig.post(endpoint, payload);
            onSuccess?.();
        } catch (err) {
            console.error("Failed to add transaction:", err);
            setError(err.response?.data?.message || "Failed to add. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
            {/* Icon Selector - Floating Style */}
            <div className="relative mb-4">
                <div
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center gap-4 cursor-pointer group"
                >
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center transition-all duration-200 border border-emerald-100 shadow-sm group-hover:shadow-md">
                        {icon ? (
                            icon.startsWith('http') || icon.startsWith('data:') ? (
                                <img src={icon} alt="icon" className="w-10 h-10 object-contain" />
                            ) : (
                                <span className="text-3xl leading-none">{icon}</span>
                            )
                        ) : (
                            <Image className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Icon</p>
                        <p className="text-xs text-emerald-600 font-medium">{icon ? "Change icon" : "Pick an icon"}</p>
                    </div>
                </div>

                {showEmojiPicker && (
                    <div className="absolute top-16 left-0 z-[60] bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-3 border-b border-gray-50 bg-gray-50/50">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Emoji</span>
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(false)}
                                className="p-1 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            width={320}
                            height={380}
                            searchPlaceHolder="Search..."
                            skinTonesDisabled
                        />
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                        {isIncome ? "Earning Source" : "Spending Name"}
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={isIncome ? "e.g., Monthly Salary" : "e.g., Grocery Shopping"}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm bg-white"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">Category</label>
                    {isFetchingCategories ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 py-3.5 bg-gray-50 rounded-lg px-4 border border-dashed border-gray-200">
                            <LoaderCircle className="animate-spin w-4 h-4 text-emerald-600" />
                            Loading categories...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-100">
                            No {isIncome ? "earnings" : "spendings"} categories found. Please create one first.
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-white shadow-sm appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading || categories.length === 0}
                    className="w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <LoaderCircle className="animate-spin w-5 h-5" />
                            Saving...
                        </>
                    ) : (
                        `Add ${isIncome ? "Earning" : "Spending"}`
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
