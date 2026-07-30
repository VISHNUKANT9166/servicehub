import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import CategorySection from "../components/CategorySection/CategorySection";
import PopularServices from "../components/PopularServices/PopularServices";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import ProfessionalSection from "../components/ProfessionalSection/ProfessionalSection";
import Footer from "../components/Footer/Footer";
function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <CategorySection />
            <PopularServices />
            <HowItWorks />
            <ProfessionalSection />
            <Footer />
        </>
    );
}

export default Home;