import { Plus } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import toast from "react-hot-toast";
import CategoryList from "../components/categoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import Modal from "../components/modal";
import AddCategoryForm from "../components/AddCategoryForm";


const Category = () => {
    useUser();

    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoryDetails = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log("Category data", response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Something went wrong please try again later", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, category);
            if (response.status === 201 || response.status === 200) {
                toast.success("Category added successfully!");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error("Error adding category", error);
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    const handleUpdateCategory = async (category) => {
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(category.id), category);
            if (response.status === 200) {
                toast.success("Category updated successfully!");
                setOpenEditCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error("Error updating category", error);
            toast.error(error.response?.data?.message || "Failed to update category");
        }
    };

    const onEditClick = (category) => {
        setSelectedCategory(category);
        setOpenEditCategoryModal(true);
    };


    return (
        <div>
            <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto">
                    {/* Add button to add category*/}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">All Categories</h2>
                            <p className="text-gray-500 mt-1">Manage your expense and income categories</p>
                        </div>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 active:scale-95 group"
                        >
                            <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                            <span>Add Category</span>
                        </button>
                    </div>

                    {/* category list */}
                    <CategoryList categories={categoryData} onEditCategory={onEditClick} />

                    {/* add the modal */}
                    <Modal 
                        isOpen={openAddCategoryModal} 
                        onClose={() => setOpenAddCategoryModal(false)}
                        title="Add New Category"
                    >
                        <AddCategoryForm onAddCategory={handleAddCategory} />
                    </Modal>

                    {/* edit the modal */}
                    <Modal 
                        isOpen={openEditCategoryModal} 
                        onClose={() => setOpenEditCategoryModal(false)}
                        title="Edit Category"
                    >
                        <AddCategoryForm 
                            onAddCategory={handleUpdateCategory} 
                            initialCategoryData={selectedCategory}
                            isEditing={true}
                        />
                    </Modal>
                </div>
            </Dashboard>
        </div>
    )
};
export default Category;