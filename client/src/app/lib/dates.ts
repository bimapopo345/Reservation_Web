export function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayInput() {
  return toDateInput(new Date());
}

export function tomorrowInput() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toDateInput(date);
}

export function isToday(value: string) {
  return value === todayInput();
}

export function isTomorrow(value: string) {
  return value === tomorrowInput();
}

export function reservationDateLabel(value: string) {
  if (isToday(value)) return "Today's Reservation";
  if (isTomorrow(value)) return "Tomorrow's Reservation";
  return 'Upcoming Reservation';
}

export function formatDisplayDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function formatVerboseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}
