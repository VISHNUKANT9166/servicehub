function StepCard({ icon, title, description }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300">

            <div className="text-5xl">
                {icon}
            </div>

            <h3 className="text-xl font-semibold mt-4">
                {title}
            </h3>

            <p className="text-gray-600 mt-3">
                {description}
            </p>

        </div>
    );
}

export default StepCard;