import dayjs from "dayjs";

export const formatDateTime = (date: string) => {
  // date is less than 1 min ago, return "just now"
  // date is less than 1 hour ago, return "x minutes ago"
  // date is less than 1 day ago, return "hh:mm A"
  // date is more than 1 day ago, return "DD/MM/YYYY"
  const now = dayjs();
  const messageDate = dayjs(date);

  if (now.diff(messageDate, 'minute') < 1) {
    return 'just now';
  }
  if (now.diff(messageDate, 'day') < 1) {
    return messageDate.format('hh:mm A');
  }
  if (now.diff(messageDate, 'year') < 1) {
    return messageDate.format('MMM DD hh:mm A');
  }
  return messageDate.format('DDD MM YYYY hh:mm A');
}