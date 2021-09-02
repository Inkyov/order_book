import React, { useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { styled, Grid, Button, Select, MenuItem } from '@material-ui/core';
import { ORDER_BOOK_TEST_IDS, MARKET_TICK_SIZES } from './OrderBookConstants';
import { subscribe, getBids, getAsks, unsubscribe } from './OrderBookService';
import AsksWidget from './components/AsksWidget';
import BidsWidget from './components/BidsWidget';

const ws = new W3CWebSocket(`wss://www.cryptofacilities.com/ws/v1`);

//eslint-disable-next-line
const Container = styled(Grid)(({ theme }) => ({
  flexDirection: 'column',
  textAlign: 'center',
  padding: 20,
  color: theme.palette.text.primary,
}));

const ToggleFeed = styled(Button)({
  backgroundColor: '#667fff',
  textTransform: 'none',
  paddingLeft: '15px',
  paddingRight: '15px',
});

const KillFeed = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.dark,
  textTransform: 'none',
  paddingLeft: '15px',
  paddingRight: '15px',
}));

const OrderBook = () => {
  // eslint-disable-next-line
  const [currentStream, setCurrentStream] = useState('PI_XBTUSD');
  const [tickSize, setTickSize] = useState('0.5');
  const [feedStoped, setFeedStoped] = useState(false);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  ws.onopen = () => {
    subscribe({ ws, stream: currentStream });
  };

  ws.onmessage = (result = '') => {
    const { data = '' } = result;
    const information = JSON.parse(data);

    if (information.event === 'unsubscribed' && !feedStoped) {
      setBids([]);
      setAsks([]);
      return;
    }

    setBids((prevBids) => getBids(prevBids, information.bids, tickSize));
    setAsks((prevAsks) => getAsks(prevAsks, information.asks, tickSize));
  };

  const handleTickSizeChange = ({
    event: {
      target: { value: size },
    },
  }) => {
    setTickSize(size);
  };

  const handleToggleFeed = () => {
    const newStream = currentStream === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD';
    unsubscribe({ ws, stream: currentStream });
    subscribe({ ws, stream: newStream });
    setTickSize(currentStream === 'PI_XBTUSD' ? '0.05' : '0.5');
    setCurrentStream(newStream);
  };

  const handleKillFeed = () => {
    if (feedStoped) {
      subscribe({ ws, stream: currentStream });
      setFeedStoped(false);
    } else {
      unsubscribe({ ws, stream: currentStream });
      setFeedStoped(true);
    }
  };

  return (
    <Container container spacing={3}>
      <Grid container data-testid={ORDER_BOOK_TEST_IDS.TABLE_HEADERS}>
        <Grid item xs>
          Order Book
        </Grid>
        <Grid item xs>
          Spread
        </Grid>
        <Grid item xs>
          <Select value={tickSize} onChange={handleTickSizeChange}>
            {MARKET_TICK_SIZES[currentStream].map((tickSize) => (
              <MenuItem key={tickSize} value={tickSize}>
                {tickSize}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container>
        <BidsWidget
          bids={bids.slice(0, 25)}
          currentStream={currentStream}
          data-testid={ORDER_BOOK_TEST_IDS.BIDS}
        />
        <AsksWidget
          asks={asks.slice(0, 25)}
          currentStream={currentStream}
          data-testid={ORDER_BOOK_TEST_IDS.ASKS}
        />
      </Grid>

      <Grid
        container
        spacing={1}
        justifyContent="center"
        data-testid={ORDER_BOOK_TEST_IDS.TRADING_PAIRS_SELECT}
      >
        <Grid item>
          <ToggleFeed size="small" onClick={handleToggleFeed}>
            Toggle Feed
          </ToggleFeed>
        </Grid>
        <Grid item>
          <KillFeed size="small" onClick={handleKillFeed}>
            Kill Feed
          </KillFeed>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderBook;
