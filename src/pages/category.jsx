import { Plus } from "lucide-react";
import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";
import toast from "react-hot-toast";
import CategoryList from "../components/categoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";


const Category =()=>{
    useUser();

    const[loading , setLoading] = useState(false);
    const[categoryData , setCategoryData] = useState([]);
    const[openAddCategoryModal , setOpenAddCategoryModal] = useState(false);
    const[openEditCategoryModal , setOpenEditCategoryModal] = useState(false);
    const[selectCategory , setSelectCategory] = useState(false);

    const fetchCategoryDetails = async()=>{
        if(loading) return;

        setLoading(true);
        try{
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if(response.status === 200){
                console.log("Category data", response.data);
                setCategoryData(response.data);
            }
        }catch(error){
            console.error("Something went wrong please try again later", error);
            toast.error(error.message );
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchCategoryDetails();
    },[]);


    return (
        <div>
            <Dashboard activeMenu="Category">
                <div className="my-5 mx-auto">
                {/* Add button to add category*/}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">All Categories</h2>
                        <button
                        className="add-btn bg-green-300 px-4 py-2 rounded flex items-center gap-1 text-white"
                        >
                        <Plus size={15} />
                        Add Category
                        </button>
                    </div>

                    {/* category list */}
                    <CategoryList categories={categoryData}/>
                </div>
            </Dashboard>
        </div>
    )
};
export default Category;