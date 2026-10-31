export const rooms = ['SHS', 'HCS', 'CTS', 'HTS', 'THC'];
export const cards = [345, 436, 456, 646];
export function solveRooms() {
  const solutions = [];
  for (let code = 0; code < 10000; code++) {
    const [letterS, letterH, letterC, letterT] = String(code).padStart(4, '0').split('').map(Number);
    const digits = { S: letterS, H: letterH, C: letterC, T: letterT };
    const values = rooms.map((room) => Number([...room].map((letter) => digits[letter]).join('')));
    const remaining = [...values];
    if (cards.every((card) => {
      const index = remaining.indexOf(card);
      if (index < 0) return false;
      remaining.splice(index, 1);
      return true;
    })) solutions.push({ digits, values, missing: remaining[0] });
  }
  return solutions;
}
export const houseCost = (count) => Array.from({ length: count }, (_, index) => String(2 * index + 1).length)
  .reduce((total, digits) => total + digits * 45000, 0);
export const teamForward = (initial) => [initial, initial * 2 / 3, initial * 8 / 3, initial * 8 / 3 - 5];