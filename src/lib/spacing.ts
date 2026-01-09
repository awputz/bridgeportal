/**
 * Centralized spacing constants for UI consistency
 * Based on 4px Tailwind scale for predictable spacing
 * 
 * Usage: Import and use in className strings
 * import { SPACING, COMPONENT_CLASSES } from '@/lib/spacing';
 */

// Base spacing values (Tailwind scale)
export const SPACING = {
  // Icon-to-text gaps
  iconTextSm: 'gap-1.5',    // 6px - tight icon+label
  iconText: 'gap-2',        // 8px - standard icon+label
  iconTextLg: 'gap-3',      // 12px - menu items, larger contexts

  // Menu/dropdown item padding
  menuItem: 'py-3 px-4',    // 12px/16px - standard menu item
  menuItemCompact: 'py-2 px-3', // 8px/12px - compact menu item

  // Card padding
  cardPadding: 'p-4',       // 16px - standard card content
  cardPaddingLg: 'p-6',     // 24px - detail pages, dialogs

  // Gaps between elements
  gapXs: 'gap-1',           // 4px
  gapSm: 'gap-2',           // 8px
  gapMd: 'gap-3',           // 12px
  gapLg: 'gap-4',           // 16px
  gapXl: 'gap-6',           // 24px

  // Vertical spacing (space-y)
  stackXs: 'space-y-1',     // 4px
  stackSm: 'space-y-2',     // 8px
  stackMd: 'space-y-3',     // 12px
  stackLg: 'space-y-4',     // 16px
  stackXl: 'space-y-6',     // 24px

  // Section dividers
  sectionDivider: 'border-t border-border/30',
  sectionDividerLight: 'border-t border-white/10',
} as const;

// Pre-composed component class patterns
export const COMPONENT_CLASSES = {
  // Dropdown menu item - standardized across all dropdowns
  dropdownItem: 'flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/6 transition-colors',
  dropdownItemCompact: 'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/6 transition-colors',

  // Info row pattern - icon + content
  infoRow: 'flex items-center gap-3',
  infoRowStart: 'flex items-start gap-3', // For multi-line content

  // Icon styling
  iconSm: 'h-3.5 w-3.5 flex-shrink-0',
  iconMd: 'h-4 w-4 flex-shrink-0',
  iconLg: 'h-5 w-5 flex-shrink-0',
  iconMuted: 'text-muted-foreground flex-shrink-0',

  // Metric card pattern
  metricCard: 'text-center p-4 rounded-lg bg-white/5',
  metricHeader: 'flex items-center justify-center gap-2 mb-2',

  // Card section with top border
  cardSection: 'py-3 border-t border-border/30',
  cardSectionLight: 'py-3 border-t border-white/10',

  // Avatar + text pattern
  avatarRow: 'flex items-center gap-3',
  avatarRowCompact: 'flex items-center gap-2',

  // Text with no margin (for cards/grids)
  textClean: 'm-0 leading-none',
} as const;

// Typography size patterns for consistency
export const TEXT_SIZES = {
  label: 'text-[10px] uppercase tracking-wide',
  caption: 'text-[11px]',
  body: 'text-[13px]',
  bodyLg: 'text-sm',
} as const;

// HR Portal specific spacing and design tokens
export const HR_SPACING = {
  // Pipeline card dimensions
  pipelineCard: 'w-[280px] min-w-[280px]',
  pipelineCardPadding: 'p-3',
  
  // Table row heights
  tableRowCompact: 'h-12',
  tableRowNormal: 'h-14',
  
  // Form sections
  formSection: 'space-y-4',
  formSectionHeader: 'text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3',
  
  // Metric cards
  metricCardPadding: 'p-4',
  metricCardGap: 'gap-3',
} as const;

// HR Status color tokens (for programmatic use with cn())
export const HR_STATUS_COLORS = {
  cold: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  contacted: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  warm: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  qualified: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  hot: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  'offer-made': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  hired: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  lost: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
} as const;

// HR Division color tokens
export const HR_DIVISION_COLORS = {
  'investment-sales': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'commercial-leasing': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'residential': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'capital-advisory': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
} as const;
