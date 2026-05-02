import { Plus } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import toast from "react-hot-toast";
import CategoryList from "../components/categoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import Modal from "../components/modal";
import CategoryForm from "../components/CategoryForm";
import PageLoader from "../components/PageLoader";


const Category = () => {
    useUser();

    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchCategoryDetails = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Something went wrong please try again later", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (formData) => {
        const categoryExists = categoryData.some(
            (c) => c.name.toLowerCase() === formData.name.toLowerCase() && c.type === formData.type
        );

        if (categoryExists) {
            toast.error("Category already exists");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, formData);
            if (response.status === 201) {
                toast.success("Category added successfully!");

                // Instantly update the list with the new category
                const newCategory = response.data || { ...formData, id: Date.now() };
                setCategoryData(prev => [...prev, newCategory]);

                setOpenAddModal(false);
            }
        } catch (error) {
            console.error("Failed to add category:", error);
            toast.error(error.response?.data?.message || "Failed to add category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditCategory = async (formData) => {
        if (!selectedCategory) return;

        const categoryExists = categoryData.some(
            (c) => c.id !== selectedCategory.id &&
                c.name.toLowerCase() === formData.name.toLowerCase() &&
                c.type === formData.type
        );

        if (categoryExists) {
            toast.error("Category already exists");
            return;
        }

        setIsSaving(true);
        try {
            const response = await axiosConfig.put(
                API_ENDPOINTS.UPDATE_CATEGORY(selectedCategory.id),
                formData
            );
            if (response.status === 200) {
                toast.success("Category updated successfully!");

                // Update local state instantly to reflect type and color changes
                setCategoryData(prev =>
                    prev.map(c =>
                        c.id === selectedCategory.id ? { ...c, ...response.data, ...formData } : c
                    )
                );

                setOpenEditModal(false);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error(error.response?.data?.message || "Failed to update category");
        } finally {
            setIsSaving(false);
        }
    };

    const onEditCategory = (category) => {
        setSelectedCategory(category);
        setOpenEditModal(true);
    };

    return (
        <div>
            <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto">
                    {/* Add button to add category*/}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">All Categories</h2>
                        <button
                            onClick={() => setOpenAddModal(true)}
                            className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add Category
                        </button>
                    </div>

                    {/* Loading state */}
                    {loading ? (
                        <PageLoader />
                    ) : (
                        /* category list */
                        <CategoryList
                            categories={categoryData}
                            onEditCategory={onEditCategory}
                        />
                    )}
                </div>
            </Dashboard>

            {/* Add Category Modal */}
            <Modal
                isOpen={openAddModal}
                onClose={() => setOpenAddModal(false)}
                title="Add New Category"
            >
                <CategoryForm
                    onSubmit={handleAddCategory}
                    isLoading={isSaving}
                    onCancel={() => setOpenAddModal(false)}
                />
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                isOpen={openEditModal}
                onClose={() => { setOpenEditModal(false); setSelectedCategory(null); }}
                title="Edit Category"
            >
                {selectedCategory && (
                    <CategoryForm
                        onSubmit={handleEditCategory}
                        isLoading={isSaving}
                        initialData={selectedCategory}
                        onCancel={() => { setOpenEditModal(false); setSelectedCategory(null); }}
                    />
                )}
            </Modal>
        </div>
    )

};
export default Category;