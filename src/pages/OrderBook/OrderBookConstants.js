import keyMirror from 'key-mirror-nested';

export const MARKET_TICK_SIZES = {
  PI_XBTUSD: ['0.5', '1', '2.5'],
  PI_ETHUSD: ['0.05', '0.1', '0.25'],
};

export const ORDER_BOOK_TEST_IDS = keyMirror({
  TRADING_PAIRS_SELECT: null,
  TABLE_HEADERS: null,
  BIDS: null,
  ASKS: null,
});

export const COMPONENT_TEST_IDS = keyMirror({
  PRICE: null,
  TOTAL: null,
  SIZE: null,
  ORDER_ROW: null,
});
