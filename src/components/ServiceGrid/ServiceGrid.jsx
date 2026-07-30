import ServiceCard from "../ServiceCard/ServiceCard";

function ServiceGrid({ services }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                />
            ))}
        </div>
    );
}

export default ServiceGrid;