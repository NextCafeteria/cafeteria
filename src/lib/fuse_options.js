const Fuse = require("fuse.js");

const fuseOptions = {
  isCaseSensitive: true,
  // includeScore: false,
  shouldSort: true,
  // includeMatches: false,
  findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["description", "name"],
};

const fuse = new Fuse(list, fuseOptions);

// Change the pattern
const searchPattern = "Samson";

return fuse.search(searchPattern);
