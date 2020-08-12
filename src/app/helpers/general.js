/* eslint-disable no-plusplus */
function generateRandomToken() {
  const rand = () => {
    return Math.random()
      .toString(36)
      .substr(2);
  };

  const token = rand() + rand();
  return token;
}

function dateDifferenceInDays(date1, date2) {
  const timeDiff = Math.abs(date2 - date1);
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function nthIndex(str, pat, n) {
  const L = str.length;
  let i = -1;
  // eslint-disable-next-line no-param-reassign
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

function removeHost(url) {
  return url.substring(nthIndex(url, '/', 3) + 1);
}

function processSortQuery(sortQuery) {
  if (sortQuery) {
    const querySplit = sortQuery.split(',');
    const queryArray = [];

    for (let i = 0; i < querySplit.length; i++) {
      queryArray.push([
        querySplit[i].substring(4),
        // asc or dsc
        querySplit[i].substring(0, 3) === 'asc' ? 'ASC' : 'DESC'
      ]);
    }
    return queryArray;
  }
  return null;
}

// eslint-disable-next-line import/prefer-default-export
export {
  generateRandomToken,
  dateDifferenceInDays,
  nthIndex,
  removeHost,
  processSortQuery
};
