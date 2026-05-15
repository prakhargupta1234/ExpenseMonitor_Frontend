import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";

const AddSpendingsForm = ({ onAddSpendings, categories }) => {
    const [spending, setSpending] = useState({
        name: "",
        categoryId: "",
        amount: "",
        date: "",
        icon: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categories && categories.length > 0 && !spending.categoryId) {
            setSpending((prev) => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [categories, spending.categoryId]);

    const handleChange = (key, value) => setSpending({ ...spending, [key]: value });

    const handleAddSpendings = async () => {
        if (!spending.name || !spending.amount || !spending.date || !spending.categoryId) {
            return;
        }
        setLoading(true);
        try {
            await onAddSpendings(spending);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5 p-2">
            <EmojiPickerPopup
                icon={spending.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={spending.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Spending Name"
                placeholder="e.g., Electricity Bill, Groceries"
                type="text"
            />

            <div className="flex flex-col mb-4">
                <label className="text-[13px] text-slate-800 mb-1 font-medium">Category</label>
                <div className="relative">
                    <select
                        value={spending.categoryId}
                        onChange={({ target }) => handleChange("categoryId", target.value)}
                        className="w-full bg-transparent border border-gray-300 rounded-md py-2.5 px-3 appearance-none text-gray-700 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    value={spending.amount}
                    onChange={({ target }) => handleChange("amount", target.value)}
                    label="Amount"
                    placeholder="e.g., 150.00"
                    type="number"
                />

                <Input
                    value={spending.date}
                    onChange={({ target }) => handleChange("date", target.value)}
                    label="Date"
                    placeholder=""
                    type="date"
                />
            </div>

            <div className="flex justify-end mt-8">
                <button
                    type="button"
                    onClick={handleAddSpendings}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 active:scale-95 mb-4"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <span>Add Spending</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddSpendingsForm;