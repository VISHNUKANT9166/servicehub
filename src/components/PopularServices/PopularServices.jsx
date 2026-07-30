import services from "../../data/services";
import ServiceCard from "../ServiceCard/ServiceCard";
function PopularServices() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center">
                    Popular Services
                </h2>

                <p className="text-center text-gray-600 mt-3">
                    Most booked services by our customers
                </p>
                <div className="grid grid-cols-4 gap-6 mt-12">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PopularServices;