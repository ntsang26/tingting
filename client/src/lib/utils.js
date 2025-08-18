export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function checkImageSize(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
}
