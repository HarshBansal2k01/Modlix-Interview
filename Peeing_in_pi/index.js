const fs = require("fs");

class Solution {
  search(pat, txt) {
    const N = txt.length;
    const M = pat.length;
    const lps = this.computeLPS(pat);

    let i = 0; // Index for text
    let j = 0; // Index for pattern

    while (i < N) {
      if (j < M && pat[j] === txt[i]) {
        i++;
        j++;
      }

      if (j === M) {
        return i - j; // Found, return 0-based index
      } else if (i < N && pat[j] !== txt[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }

    return -1; // Pattern not found
  }

  computeLPS(pattern) {
    const M = pattern.length;
    const lps = new Array(M).fill(0);
    let length = 0; // Length of previous longest prefix suffix
    let i = 1;

    while (i < M) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else {
        if (length !== 0) {
          length = lps[length - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }
}


function loadPiDigits(filename) {
  return fs.readFileSync(filename, "utf8").trim(); 
}

// Load Pi digits 
const piDigits = loadPiDigits("pi_1billion.txt");
// in this file you have a demo number of digits to check the code gives the correct result or not
const CheckingForCorrectData = loadPiDigits("num.txt");

// Example queries
const solution = new Solution();
const queries = ["314159", "271828", "123456"];
const checkResult = ["123", "312", "00"];
const results = {};
const checkResults = {};

queries.forEach((query) => {
  results[query] = solution.search(query, piDigits);
});
checkResult.forEach((query) => {
  checkResults[query] = solution.search(query, CheckingForCorrectData);
});

console.log(results);
console.log(checkResults);
