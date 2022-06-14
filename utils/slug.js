const convertToSlug = (text) => {
  return text
    .toString() // Cast to string
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .replace(/[^\w\-\s]+/g, '') // Remove all non-word chars
    .trim() // Remove whitespace from both sides of a string
    .replace(/[\-\s]+/g, '-') // Replace spaces with -
}

module.exports = { convertToSlug }
