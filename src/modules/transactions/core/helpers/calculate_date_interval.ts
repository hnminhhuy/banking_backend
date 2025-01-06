export function daysUntilNextOccurrence(): {
  daysToFirst: number;
  daysToMonday: number;
} {
  const today = new Date(); // Ngày hiện tại
  const year = today.getFullYear();
  const month = today.getMonth(); // Lấy tháng hiện tại (0-11)

  const firstDayOfMonth = new Date(year, month, 1);

  const daysToFirst = Math.floor(
    (firstDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dayOfWeek = today.getDay(); // Chủ nhật = 0, Thứ hai = 1, ..., Thứ bảy = 6
  const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Nếu Chủ nhật thì 6 ngày, nếu không thì lùi về Thứ Hai

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysToLastMonday);

  const daysToMonday = Math.floor(
    (today.getTime() - lastMonday.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    daysToFirst: Math.abs(daysToFirst) - 1, // Không âm
    daysToMonday: Math.abs(daysToMonday), // Không âm
  };
}
