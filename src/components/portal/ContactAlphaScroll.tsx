import { useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ContactAlphaScrollProps {
  contacts: { full_name: string; id: string }[];
  currentLetter?: string;
  onLetterClick: (letter: string) => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

export function ContactAlphaScroll({
  contacts,
  currentLetter,
  onLetterClick,
}: ContactAlphaScrollProps) {
  // Calculate which letters have contacts
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    contacts.forEach((contact) => {
      const firstChar = contact.full_name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      } else {
        letters.add("#");
      }
    });
    return letters;
  }, [contacts]);

  const handleLetterClick = useCallback(
    (letter: string) => {
      if (availableLetters.has(letter)) {
        onLetterClick(letter);
      }
    },
    [availableLetters, onLetterClick]
  );

  return (
    <div className="hidden lg:flex flex-col items-center gap-0.5 fixed right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full py-2 px-1 border border-border/50 shadow-lg">
      {ALPHABET.map((letter) => {
        const hasContacts = availableLetters.has(letter);
        const isActive = currentLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={!hasContacts}
            className={cn(
              "w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full transition-all",
              hasContacts
                ? "hover:bg-primary/20 hover:text-primary cursor-pointer"
                : "text-muted-foreground/30 cursor-default",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

// Helper function to group contacts by first letter
export function groupContactsByLetter<T extends { full_name: string }>(
  contacts: T[]
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  contacts.forEach((contact) => {
    const firstChar = contact.full_name.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : "#";

    if (!groups.has(letter)) {
      groups.set(letter, []);
    }
    groups.get(letter)!.push(contact);
  });

  // Sort the map by keys
  return new Map(
    [...groups.entries()].sort((a, b) => {
      if (a[0] === "#") return 1;
      if (b[0] === "#") return -1;
      return a[0].localeCompare(b[0]);
    })
  );
}
