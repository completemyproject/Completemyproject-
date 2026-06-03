import HeroTop from "./hero/HeroTop";
import TrustVetting from "./hero/TrustVetting";
import DidYouKnow from "./hero/DidYouKnow";
import HowItWorksTabs from "./hero/HowItWorksTabs";
import ReferAFriend from "./hero/ReferAFriend";
import AffiliatedNetworkStrip from "./hero/AffiliatedNetworkStrip";
import IntroVideo from "./hero/IntroVideo";

type HeroProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onQuickChip: (chip: string) => void;
};

export default function Hero({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onQuickChip,
}: HeroProps) {
  return (
    <>
      <HeroTop
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        onSearch={onSearch}
        onQuickChip={onQuickChip}
      />
      <AffiliatedNetworkStrip />
      <IntroVideo />
      <TrustVetting />
      <DidYouKnow />
      <HowItWorksTabs />
      <ReferAFriend />
    </>
  );
}
