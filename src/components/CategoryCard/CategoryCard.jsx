function CategoryCard({ name, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer">

            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                {icon}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {name}
            </h3>

        </div>
    );
}

export default CategoryCard;