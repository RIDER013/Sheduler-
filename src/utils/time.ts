import { TimeBlock } from '../types';

/**
 * Convert "HH:mm" to total minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Format "HH:mm" into 12-hour AM/PM format
 */
export function formatFriendlyTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const hours = parseInt(hStr, 10);
  const minutes = mStr || '00';
  const minsNum = parseInt(minutes, 10);
  const minsFormatted = minsNum < 10 ? `0${minsNum}` : `${minsNum}`;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minsFormatted} ${ampm}`;
}

/**
 * Calculate duration between two "HH:mm" strings
 */
export function calculateDuration(startTime: string, endTime: string): string {
  const startMins = timeToMinutes(startTime);
  let endMins = timeToMinutes(endTime);

  // If spans across midnight (e.g., 22:30 to 06:00)
  if (endMins < startMins) {
    endMins += 24 * 60;
  }

  const diffMins = Math.max(0, endMins - startMins);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} mins`;
  } else if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} mins`;
}

/**
 * Find the currently active block based on current time
 */
export function findActiveBlock(
  blocks: TimeBlock[],
  now: Date
): { active: TimeBlock | null; remainingMinutes: number; percentElapsed: number } {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const block of blocks) {
    const start = timeToMinutes(block.startTime);
    let end = timeToMinutes(block.endTime);

    // Cross-midnight handling
    if (end < start) {
      if (currentMinutes >= start || currentMinutes < end) {
        const totalDuration = (24 * 60 - start) + end;
        const elapsed = currentMinutes >= start ? (currentMinutes - start) : ((24 * 60 - start) + currentMinutes);
        const remaining = Math.max(0, totalDuration - elapsed);
        const percent = Math.min(100, Math.round((elapsed / totalDuration) * 100));
        return { active: block, remainingMinutes: remaining, percentElapsed: percent };
      }
    } else {
      if (currentMinutes >= start && currentMinutes < end) {
        const totalDuration = end - start;
        const elapsed = currentMinutes - start;
        const remaining = Math.max(0, end - currentMinutes);
        const percent = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 100;
        return { active: block, remainingMinutes: remaining, percentElapsed: percent };
      }
    }
  }

  return { active: null, remainingMinutes: 0, percentElapsed: 0 };
}

/**
 * Returns formatted date in English
 */
export function formatCurrentDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
