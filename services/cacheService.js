const { createCachableFetcher, fetchData } = require("../practice");
const cachedFetch = createCachableFetcher(fetchData);

module.exports = {
    cachedFetch
};

