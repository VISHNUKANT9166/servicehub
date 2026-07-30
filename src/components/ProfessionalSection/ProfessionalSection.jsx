import professionals from "../../data/professionals";
import ProfessionalCard from "../ProfessionalCard/ProfessionalCard";

function ProfessionalSection() {
    return (
        <section className="py-20 bg-gray-50">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    Top Professionals
                </h2>

                <p className="text-center text-gray-600 mt-3">
                    Meet our highest-rated service professionals
                </p>

                <div className="grid grid-cols-4 gap-6 mt-12">
                    {professionals.map((professional) => (
                        <ProfessionalCard
                            key={professional.id}
                            name={professional.name}
                            profession={professional.profession}
                            rating={professional.rating}
                            jobsCompleted={professional.jobsCompleted}
                        />
                    ))}
                </div>

            </div>

        </section>
    );
}

export default ProfessionalSection;