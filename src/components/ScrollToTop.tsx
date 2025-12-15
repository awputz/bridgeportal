// ScrollToTop is now handled by PageTransition component
// This component is kept for backwards compatibility but does nothing
// The PageTransition component scrolls after the exit animation completes

export const ScrollToTop = () => {
  // Scroll is handled by PageTransition.handleAnimationEnd
  return null;
};
