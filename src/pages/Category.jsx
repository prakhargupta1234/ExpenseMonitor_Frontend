import { Plus, Layers2, TrendingUp, TrendingDown } from "lucide-react";
import Dashboard from "./components/Dashboard";
import { useUser } from "./hooks/useUser";
import toast from "react-hot-toast";
import CategoryList from "./components/categoryList";
import { useEffect, usenpmState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndPoints";
import Modal from "./components/Modal";
import AddCategoryForm from "./components/AddCategoryForm";


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


    const earningsCategoriesCount = categoryData.filter(c => c.type?.toLowerCase() === 'income' || c.type?.toLowerCase() === 'earnings').length;
    const spendingsCategoriesCount = categoryData.filter(c => c.type?.toLowerCase() === 'expense' || c.type?.toLowerCase() === 'spendings').length;

    return (
        <div>
            <Dashboard activeMenu="Categories">
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your spendings and earnings classifications</p>
                        </div>
                        <button
                            onClick={() => setOpenAddCategoryModal(true)}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm shadow-sm hover:shadow-md active:scale-[0.97] group"
                        >
                            <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                            <span>Add Category</span>
                        </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categoryData.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <Layers2 size={20} />
                            </div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Earnings Types</p>
                                <p className="text-2xl font-bold text-emerald-800">{earningsCategoriesCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Spendings Types</p>
                                <p className="text-2xl font-bold text-red-800">{spendingsCategoriesCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                <TrendingDown size={20} />
                            </div>
                        </div>
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