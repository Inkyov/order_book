import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

import OrderBook from './OrderBook';
import { ORDER_BOOK_TEST_IDS } from './OrderBookConstants';

const renderComponent = () => render(<OrderBook />);

describe('OrderBook', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });
  it('should render the select for choosing a trading pair', () => {
    const { getByTestId } = renderComponent();

    const tradingPairsSelect = getByTestId(
      ORDER_BOOK_TEST_IDS.TRADING_PAIRS_SELECT
    );
    expect(tradingPairsSelect).toBeVisible();
  });
  it('should render table headers', () => {
    const { getByTestId } = renderComponent();

    const tableHeaders = getByTestId(ORDER_BOOK_TEST_IDS.TABLE_HEADERS);
    expect(tableHeaders).toBeVisible();
  });
  it('should render bids data', () => {
    const { getByTestId } = renderComponent();

    const bids = getByTestId(ORDER_BOOK_TEST_IDS.BIDS);
    expect(bids).toBeVisible();
  });
  it('should render asks data', () => {
    const { getByTestId } = renderComponent();

    const asks = getByTestId(ORDER_BOOK_TEST_IDS.ASKS);
    expect(asks).toBeVisible();
  });
});
