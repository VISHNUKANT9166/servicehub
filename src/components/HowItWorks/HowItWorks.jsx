import howItWorks from "../../data/howItWorks";
import StepCard from "../StepCard/StepCard";

function HowItWorks() {
    return (
        <section className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    How It Works
                </h2>

                <p className="text-center text-gray-600 mt-3">
                    Book a service in just 3 simple steps
                </p>
                <div className="grid grid-cols-3 gap-8 mt-12">
                    {howItWorks.map((step) => (
                        <StepCard
                            key={step.id}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>

            </div>

        </section>
    );
}

export default HowItWorks;