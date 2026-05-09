import {useEffect, useState} from "react";
import Input from "./Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import {LoaderCircle} from "lucide-react";

const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing}) => {
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
            setCategory({name: "", type: "income", icon: ""});
        }
    }, [isEditing, initialCategoryData]);

    const categoryTypeOptions = [
        {value: "income", label: "Income"},
        {value: "expense", label: "Expense"},
    ]

    const handleChange = (key, value) => {
        setCategory({...category, [key]: value})
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
        }finally {
            setLoading(false);
        }
    }
    return (
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({target}) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 active:scale-95 mb-4"
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