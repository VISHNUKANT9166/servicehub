function ProfessionalCard({
    name,
    profession,
    rating,
    jobsCompleted,
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300">

            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-5xl mx-auto">
                👨‍🔧
            </div>

            <h3 className="text-xl font-semibold mt-5">
                {name}
            </h3>

            <p className="text-gray-600 mt-2">
                {profession}
            </p>

            <p className="text-yellow-500 font-medium mt-3">
                ⭐ {rating}
            </p>

            <p className="text-gray-500 mt-2">
                {jobsCompleted} Jobs Completed
            </p>

            <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                View Profile
            </button>

        </div>
    );
}

export default ProfessionalCard;