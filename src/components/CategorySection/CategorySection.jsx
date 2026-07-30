import categories from "../../data/categories";
import CategoryCard from "../CategoryCard/CategoryCard";

function CategorySection() {
    return (
        <section className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    Browse Categories
                </h2>

                <p className="text-center text-gray-600 mt-3">
                    Choose the service you need
                </p>
                <div className="grid grid-cols-4 gap-6 mt-12">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            name={category.name}
                            icon={category.icon}
                        />
                    ))}
                </div>

            </div>

        </section>
    );
}

export default CategorySection;