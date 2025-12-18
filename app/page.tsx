import ContentSection from "@/components/content";
import Features from "@/components/features";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Pricing from "@/components/pricing";

export default async function Home() {
    return (
        <>
            <HeroSection />
            <Features />
            <Pricing />
            <ContentSection /> {/*About */}
            <FooterSection />
        </>
    );
}
