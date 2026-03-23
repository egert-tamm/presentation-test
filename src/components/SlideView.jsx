import { CoverSlide } from "./slides/CoverSlide";
import { StatsSidebarSlide } from "./slides/StatsSidebarSlide";
import { GridCardsSlide } from "./slides/GridCardsSlide";
import { ChapterSlide } from "./slides/ChapterSlide";
import { TeamSlide } from "./slides/TeamSlide";
import { PortfolioSlide } from "./slides/PortfolioSlide";
import { AdvantageSlide } from "./slides/AdvantageSlide";
import { CTASlide } from "./slides/CTASlide";
import { QuoteSlide } from "./slides/QuoteSlide";

const SLIDE_MAP = {
  cover: CoverSlide,
  stats_sidebar: StatsSidebarSlide,
  grid_cards: GridCardsSlide,
  chapter: ChapterSlide,
  team: TeamSlide,
  portfolio: PortfolioSlide,
  advantage: AdvantageSlide,
  cta: CTASlide,
  quote: QuoteSlide,
};

export const SlideView = ({ slide, index, total }) => {
  if (!slide) return null;
  const Component = SLIDE_MAP[slide.type] || ChapterSlide;
  return <Component s={slide} i={index} n={total} />;
};
