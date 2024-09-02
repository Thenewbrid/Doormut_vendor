function median(ratings) {
  const ratingValues = Object.values(ratings);
  const sortedRatings = ratingValues.sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedRatings.length / 2);

  if (sortedRatings.length % 2 === 0) {
    return sortedRatings[middleIndex - 1] + sortedRatings[middleIndex];
  } else {
    return sortedRatings[middleIndex];
  }
}

module.exports= median;