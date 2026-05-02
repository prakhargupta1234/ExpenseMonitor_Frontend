import { Layers2, Pencil } from "lucide-react";

const CategoryList=({categories, onEditCategory}) => {
    return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Category Sources</h4>
        </div>

        {/* Category list */}
        {categories.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
            No categories added yet. Add some to get started!
        </p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
            <div 
                key={category.id} 
                className="group relative flex items-center gap-4 p-3.5 rounded-lg border border-gray-50 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >   
                {/* icon /emoji display */}
                <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
                    {category.icon ? (
                        <img src={category.icon} alt={category.name} className="w-6 h-6" />
                    ):(
                        <Layers2 className="text-purple-600" size={20}/>
                    )}
                </div>
                {/* category details */}

                <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="min-w-0">
                          {/* category name and type  */}
                        <h5 className="font-medium text-sm text-gray-900 truncate">{category.name}</h5>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            category.type === "INCOME" 
                                ? "bg-green-50 text-green-600" 
                                : "bg-red-50 text-red-600"
                        }`}>
                            {category.type}
                        </span>
                    </div>
                </div>
              
                {/* actions buttons  */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEditCategory?.(category)}
                        className="p-1.5 rounded-md text-gray-300 hover:text-blue-500 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer duration-200"
                    >
                        <Pencil size={15} />
                    </button>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
);
}

export default CategoryList;