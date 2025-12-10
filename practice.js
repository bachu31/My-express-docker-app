/**
* In your Node.js application, you have a function fetchData(id) that is expensive to call (e.g., it queries a slow, external API). You need to create a caching mechanism to avoid calling fetchData multiple times for the same id. Write a higher-order function createCachableFetcher() that returns a new, "cachable" version of the fetcher function. This new function should:
* Maintain an internal cache.
* 1. When called with an id, first check if the result for this id is already in the cache.
* 2. If it is, return the cached result immediately without calling fetchData.
* 3. If it is not, call the original fetchData(id), store the result in the cache, and then return the result.

* Crucially: If the cachable fetcher is called for the same id multiple times before the first call has finished, it should not trigger multiple fetchData calls. All calls should await the result of the single in-flight request.
*/
/**
* Simulates a slow and expensive API call.
* @param {string} id - The ID of the data to fetch.
* @returns {Promise<object>} A promise that resolves with the fetched data.
*/
function fetchData(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Fetched data completed for Id: ${id}`);
            resolve("Fetched")
        },500)
    })
}


// in-memory
const cacheData = {};
// async function createCachableFetcher(id) {
// // your implementation
//     try {
//         // console.log(cacheData);
//         if (cacheData[id]) {
//             return cacheData[id];
//         }
//         const promise = fetchData(id);
//         cacheData[id] = promise;
//     } catch (error) {
//         console.log("Error while fetching data for ", id);
//     }
// }

// Promise.all([createCachableFetcher(1), createCachableFetcher(2), createCachableFetcher(1)])
// createCachableFetcher(1)
// createCachableFetcher(2)
// createCachableFetcher(1)

// Output:
// Fetched data completed for Id: 1
// Fetched data completed for Id: 2

// In-memory cache
const newcacheData = {};
const pendingRequests = {};

/**
 * Higher-order function that returns a cachable fetcher.
 * @returns {Function} A function that checks cache first, and makes the fetch request if necessary.
 */


function createCachableFetcher(fetchFn) {
    const cache = {};
    const pending = {};

    return async function (id) {
        // Use cached result if exists
        if (cache[id]) return cache[id];

        // If a request is already in flight → wait for it
        if (pending[id]) return pending[id];

        // Fire a new request
        const promise = fetchFn(id);
        pending[id] = promise;

        try {
            const result = await promise;
            cache[id] = result;   
            delete pending[id];     
            return result;
        } catch (e) {
            delete pending[id];
            throw e;
        }
    };
}

module.exports = { createCachableFetcher, fetchData };
