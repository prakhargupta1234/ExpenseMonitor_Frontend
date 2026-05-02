import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const CategoryForm = ({ onSubmit, isLoading, initialData = null, onCancel }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [icon, setIcon] = useState(initialData?.icon || "");
    const [type, setType] = useState(initialData?.type || "EXPENSE");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Category name is required");
            return;
        }

        onSubmit({ 
            ...(initialData?.id ? { id: initialData.id } : {}),
            name: name.trim(), 
            icon, 
            type 
        });
    };

    const onEmojiClick = (emojiObject) => {
        setIcon(emojiObject.imageUrl || emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Icon Selector */}
            <div className="relative">
                <div className="flex items-center gap-4">
                    <div 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors shadow-sm border border-purple-100"
                    >
                        {icon ? (
                            <img src={icon} alt="icon" className="w-8 h-8" />
                        ) : (
                            <span className="text-purple-400 text-2xl">+</span>
                        )}
                    </div>
                    <span 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-sm font-medium text-gray-700 cursor-pointer hover:text-purple-700"
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

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Groceries, Salary"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-white shadow-sm"
                >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2.5 px-6 bg-[#7c26f0] text-white rounded-lg hover:bg-[#6819d4] transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2 ${
                        isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? (
                        <>
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            Saving...
                        </>
                    ) : (
                        initialData ? "Update Category" : "Add Category"
                    )}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
