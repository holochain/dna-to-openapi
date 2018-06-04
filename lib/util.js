'use strict'

/**
 * Safe get helper
 * @private
 * @param {object} obj - the haystack
 * @param {string} path - dot separated path to find
 * @param {*} [def] - default value if path is not found
 */
exports.get = function get (obj, path, def) {
  let cur = obj
  for (let part of path.split('.')) {
    if (!(part in cur)) {
      return def
    }
    cur = cur[part]
  }
  return cur
}
