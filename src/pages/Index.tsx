import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Reviews from "@/components/Reviews";
import JoinPanel from "@/components/JoinPanel";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { resolveProjectFromQuery } from "@/data/services";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const goToGetQuotes = useCallback(
    (query: string) => {
      const project = resolveProjectFromQuery(query);
      if (project) {
        navigate(`/get-quotes?projects=${encodeURIComponent(project)}`);
      } else {
        navigate("/get-quotes");
      }
    },
    [navigate],
  );

  const handleSearch = useCallback(() => {
    goToGetQuotes(searchQuery);
  }, [goToGetQuotes, searchQuery]);

  const handleQuickChip = useCallback(
    (chip: string) => {
      setSearchQuery(chip);
      goToGetQuotes(chip);
    },
    [goToGetQuotes],
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onQuickChip={handleQuickChip}
        />
        <Services searchQuery={searchQuery} />
        <Reviews />
        <FaqSection />
        <JoinPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
