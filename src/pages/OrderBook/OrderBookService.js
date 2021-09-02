import { filter, map, isEmpty, find, reduce, includes, slice } from 'lodash/fp';

export function subscribe({ ws, stream }) {
  return ws.send(
    JSON.stringify({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [stream],
    })
  );
}

export function unsubscribe({ ws, stream }) {
  return ws.send(
    JSON.stringify({
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [stream],
    })
  );
}

export const calculateTotal = (data, entry, index) => {
  const levelSize = entry[1];
  const levelSizesToSum = slice(0, index, data);
  const sumOfSizes = reduce((sum, level) => sum + level[1], 0, levelSizesToSum);

  return levelSize + sumOfSizes;
};

export const calculateDepth = (data, entry, index) => {
  const priceLevelTotal = calculateTotal(data, entry, index);
  const maxTotal = reduce((sum, level) => sum + level[1], 0, data);

  return parseFloat((priceLevelTotal / maxTotal) * 100).toFixed(2);
};

// export const calculateDepth = (total, orderBookTotal) =>
//   parseFloat((total / orderBookTotal) * 100).toFixed(2);

export const transformData = (priceLevels, delta) => {
  // an array with the already existing price levels
  const oldPriceLevels = reduce(
    (arr, priceLevel) => {
      arr.push(priceLevel[0]);
      return arr;
    },
    [],
    priceLevels
  );

  // the price levels from the delta that need to be added to the current ones
  const newPriceLevels = reduce(
    (arr, priceLevel) => {
      // if the level from the delta is not part of the current price levels it should be added
      if (!includes(priceLevel[0], oldPriceLevels)) {
        arr.push(priceLevel);
        return arr;
      }
      return arr;
    },
    [],
    delta
  );

  // overwrite the existing price level with new data
  const overwrittenPriceLevels = map((priceLevel) => {
    const newPriceLevel = find(
      (priceLevelDelta) => priceLevel[0] === priceLevelDelta[0],
      delta
    );

    // if there isn't an update for the price level return it as it is otherwise return the updated price level
    return !newPriceLevel ? priceLevel : newPriceLevel;
  }, priceLevels).concat(newPriceLevels); // add new price levels

  // remove the ones that have a size of 0 and return the rest
  const updatedPriceLevels = isEmpty(delta)
    ? priceLevels
    : filter((priceLevel) => priceLevel[1] !== 0, overwrittenPriceLevels);

  return updatedPriceLevels.reduce((arr, priceLevel, index) => {
    const total = calculateTotal(updatedPriceLevels, priceLevel, index);
    arr.push([priceLevel[0], priceLevel[1], total]);
    return arr;
  }, []);
};

export const formatPrice = (price) => parseFloat(price).toFixed(2);

export const getBids = (currentPriceLevels, delta, tickSize) =>
  transformData(currentPriceLevels, delta, tickSize).sort(
    (a, b) => b[0] - a[0]
  ); // sort in descending order

export const getAsks = (currentPriceLevels, delta, tickSize) =>
  transformData(currentPriceLevels, delta, tickSize).sort(
    (a, b) => a[0] - b[0]
  ); // sort in ascending order
