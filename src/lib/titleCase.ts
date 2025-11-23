/**
 * Converts a string to title case, keeping articles, conjunctions, and short prepositions lowercase
 */
export function toTitleCase(str: string): string {
  const smallWords = /^(a|an|and|as|at|but|by|for|if|in|nor|of|on|or|so|the|to|up|yet)$/i;
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Always capitalize first and last word
      if (index === 0 || index === array.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Keep small words lowercase unless they're the first or last word
      if (smallWords.test(word)) {
        return word;
      }
      
      // Capitalize all other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
