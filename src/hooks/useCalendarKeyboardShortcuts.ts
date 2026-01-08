import { useEffect, useCallback } from "react";

export type ViewMode = 'day' | '3day' | 'week' | 'month' | 'agenda';

interface KeyboardShortcutsOptions {
  onToday: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onViewChange: (view: ViewMode) => void;
  onCreateEvent: () => void;
  onOpenSearch?: () => void;
  onShowHelp: () => void;
  enabled?: boolean;
}

export function useCalendarKeyboardShortcuts(options: KeyboardShortcutsOptions) {
  const {
    onToday,
    onNext,
    onPrevious,
    onViewChange,
    onCreateEvent,
    onOpenSearch,
    onShowHelp,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if disabled
    if (!enabled) return;
    
    // Skip if user is typing in an input or textarea
    const target = e.target as HTMLElement;
    if (
      target instanceof HTMLInputElement || 
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable ||
      target.closest('[role="dialog"]') ||
      target.closest('[data-radix-popper-content-wrapper]')
    ) {
      return;
    }

    // Skip if modifier keys are pressed (except for ?)
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key.toLowerCase()) {
      // Navigation
      case 't':
        e.preventDefault();
        onToday();
        break;
      case 'j':
      case 'arrowright':
        if (e.key === 'ArrowRight' && !e.shiftKey) {
          e.preventDefault();
          onNext();
        } else if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          onNext();
        }
        break;
      case 'k':
      case 'arrowleft':
        if (e.key === 'ArrowLeft' && !e.shiftKey) {
          e.preventDefault();
          onPrevious();
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          onPrevious();
        }
        break;

      // View Switching
      case 'm':
        e.preventDefault();
        onViewChange('month');
        break;
      case 'w':
        e.preventDefault();
        onViewChange('week');
        break;
      case 'd':
        e.preventDefault();
        onViewChange('day');
        break;
      case '3':
        e.preventDefault();
        onViewChange('3day');
        break;
      case 'a':
        e.preventDefault();
        onViewChange('agenda');
        break;

      // Actions
      case 'c':
        e.preventDefault();
        onCreateEvent();
        break;
      case '/':
        e.preventDefault();
        onOpenSearch?.();
        break;
      case '?':
        e.preventDefault();
        onShowHelp();
        break;
    }
  }, [enabled, onToday, onNext, onPrevious, onViewChange, onCreateEvent, onOpenSearch, onShowHelp]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
