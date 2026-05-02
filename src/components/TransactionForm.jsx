import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
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

    const isIncome = type === "income";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryType = isIncome ? "INCOME" : "EXPENSE";
                const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE(categoryType));
                setCategories(response.data || []);
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
            setError(`Please enter a valid ${isIncome ? "income" : "expense"} source`);
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
            const endpoint = isIncome ? API_ENDPOINTS.ADD_INCOME : API_ENDPOINTS.ADD_EXPENSE;
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
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Icon Selector */}
            <div className="relative pt-2">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors shadow-sm border border-purple-100"
                    >
                        {icon ? (
                            icon.startsWith('http') || icon.startsWith('data:') ? (
                                <img src={icon} alt="icon" className="w-8 h-8 object-contain" />
                            ) : (
                                <span className="text-3xl leading-none">{icon}</span>
                            )
                        ) : (
                            <span className="text-3xl leading-none">😃</span>
                        )}
                    </div>
                    <span
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#7c26f0] transition-colors"
                    >
                        Change icon
                    </span>
                </div>
                {showEmojiPicker && (
                    <div className="absolute top-16 left-0 z-50 bg-white shadow-xl rounded-lg border border-gray-100">
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            width={320}
                            height={350}
                            searchPlaceHolder="Search emoji..."
                        />
                    </div>
                )}
            </div>

            {/* Income/Expense Source */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    {isIncome ? "Income Source" : "Expense Source"}
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., job"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-[#7c26f0] focus:ring-1 focus:ring-[#7c26f0] transition-all shadow-sm"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category</label>
                {isFetchingCategories ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                        <LoaderCircle className="animate-spin w-4 h-4" />
                        Loading categories...
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                        No {isIncome ? "income" : "expense"} categories found. Please create one first.
                    </p>
                ) : (
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-[#7c26f0] focus:ring-1 focus:ring-[#7c26f0] transition-all bg-white shadow-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Amount</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 500.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-[#7c26f0] focus:ring-1 focus:ring-[#7c26f0] transition-all shadow-sm"
                />
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-[#7c26f0] focus:ring-1 focus:ring-[#7c26f0] transition-all shadow-sm"
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isLoading || categories.length === 0}
                    className={`py-2.5 px-6 bg-[#7c26f0] text-white rounded-lg hover:bg-[#6819d4] transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2 ${(isLoading || categories.length === 0) ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                    {isLoading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            Saving...
                        </>
                    ) : (
                        `Add ${isIncome ? "Income" : "Expense"}`
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;