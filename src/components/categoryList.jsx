import { Layers2, Pencil } from "lucide-react";

const CategoryList = ({ categories, onEditCategory }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-bold text-gray-900">Category Sources</h4>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
                    {categories.length} total
                </span>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-10">
                    No categories added yet. Add some to get started!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-emerald-200 hover:shadow-md hover:bg-emerald-50/20 transition-all duration-300"
                        >
                            {/* icon /emoji display */}
                            <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                category.type?.toLowerCase() === "income" ? "bg-emerald-50 group-hover:bg-emerald-100" : "bg-red-50 group-hover:bg-red-100"
                            }`}>
                                {category.icon ? (
                                    category.icon.startsWith('http') || category.icon.startsWith('data:') ? (
                                        <img src={category.icon} alt={category.name} className="w-6 h-6 object-contain" />
                                    ) : (
                                        <span className="text-xl leading-none">{category.icon}</span>
                                    )
                                ) : (
                                    <span className={`font-bold text-sm ${category.type?.toLowerCase() === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {(category.name || "C").charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {/* category details */}
                            <div className="flex-1 flex items-center justify-between min-w-0">
                                <div className="min-w-0">
                                    <h5 className="font-semibold text-sm text-gray-900 truncate capitalize">{category.name}</h5>
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize inline-block mt-1 ${
                                        category.type?.toLowerCase() === "income"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-500"
                                    }`}>
                                        {category.type}
                                    </span>
                                </div>
                            </div>

                            {/* actions buttons  */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditCategory?.(category)}
                                    className="p-2 rounded-xl text-gray-300 hover:text-emerald-600 hover:bg-emerald-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer duration-200"
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
};

export default CategoryList;