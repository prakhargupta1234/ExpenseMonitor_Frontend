import { Layers2, Pencil } from "lucide-react";

const categoryList=({categories, onEditCategory , onDeleteCategory}) => {
    return (
    <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Category Sources</h4>
        </div>

        {/* Category list */}
        {categories.length === 0 ? (
        <p className="text-gray-500">
            No categories added yet. Add some to get started!
        </p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
            <div 
                key={category.id} 
                className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60"
            >   
                {/* icon /emoji display */}
                <div className="group relative flex items-center text-xl  justify-center text-gray-800 bg-gray-200 rounded-full ">
                    {category.icon ? (
                        <span className="text-2xl">
                            <img src={category.icon} alt={category.name} className="h5 w-5" />

                        </span>
                    ):(
                        <Layers2 className="text-purple-800" size={24}/>
                    )}
                </div>
                {/* category details */}

                <div className="flex-1 flex items-center justify-between">
                    <div>
                          {/* category name and type  */}
                        <h5 className="font-medium">{category.name}</h5>
                        <p className="text-sm text-gray-500">{category.type}</p>
                    </div>
                </div>
              
                {/* actions buttons  */}
                <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200">
                        <Pencil size={16} />
                    </button>

                </div>
            </div>
            ))}
        </div>
        )}
    </div>
);
}

export default categoryList;