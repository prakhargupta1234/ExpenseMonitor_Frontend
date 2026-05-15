import { useEffect, useState } from "react";
import Input from "./Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import { LoaderCircle } from "lucide-react";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({ name: "", type: "income", icon: "" });
        }
    }, [isEditing, initialCategoryData]);

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value })
    }

    const handleSubmit = async () => {
        if (!category.name || !category.type) {
            return;
        }
        setLoading(true);
        try {
            await onAddCategory(category);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 p-2">
            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <div className="grid grid-cols-1 gap-5">
                <Input
                    value={category.name}
                    onChange={({ target }) => handleChange("name", target.value)}
                    label="Category Name"
                    placeholder="e.g., Freelance, Salary, Groceries"
                    type="text"
                />

                <div className="flex flex-col">
                    <label className="text-[13px] text-slate-800 mb-2 block font-medium">Category Type</label>
                    <div className="relative">
                        <select
                            value={category.type}
                            onChange={({ target }) => handleChange("type", target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded-md py-2.5 px-3 appearance-none text-gray-700 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
                        >
                            <option value="income">Earnings</option>
                            <option value="expense">Spendings</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-100 hover:shadow-xl hover:shadow-emerald-200 active:scale-95 mb-4"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                            <span>{isEditing ? "Updating..." : "Adding..."}</span>
                        </>
                    ) : (
                        <span>{isEditing ? "Update Category" : "Add Category"}</span>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm;