function StatsCard({
    title,
    value,
    icon,
    color,
}) {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>

                </div>

                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}

export default StatsCard;