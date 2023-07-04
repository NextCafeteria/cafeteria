export function validateURL(url) {
  const parsed = new URL(url)
  return ["https:", "http:"].includes(parsed.protocol)
}
// Usage:  console.log("Valid url?",validateUrl('https://www.
