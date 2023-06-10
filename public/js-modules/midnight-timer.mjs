function timeUntilMidnight(savedMidnight) {
  let now = new Date();
  const timeUntil = savedMidnight - now;
  const seconds = Math.floor((timeUntil % 60000) / 1000);
  const minutes = Math.floor((timeUntil % 3600000) / 60000);
  const hours = Math.floor(timeUntil / 3600000);
  const timeString = `
          ${hours
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}h
          ${minutes
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}m
          ${seconds
            .toString()
            .padStart(2, "0")
            .split("")
            .map((digit) => `<span class="digit">${digit}</span>`)
            .join("")}s`;

  return timeString
}

export { timeUntilMidnight };
