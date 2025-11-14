import ContentSection from "@/components/content-4";
import Features from "@/components/features-1";
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
