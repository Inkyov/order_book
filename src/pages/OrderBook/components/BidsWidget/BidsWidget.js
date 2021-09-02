import React from 'react';
import { isEmpty } from 'lodash/fp';
import { Grid, styled } from '@material-ui/core';
import PropTypes from 'prop-types';
import { formatPrice, calculateDepth } from '../../OrderBookService';
import { COMPONENT_TEST_IDS } from '../../OrderBookConstants';

const GridItem = styled(Grid)(({ theme, price }) => ({
  flex: 1,
  marginBottom: theme.spacing(1),
  color: price && theme.palette.success.main,
}));

const DataContainer = styled(Grid)(({ depthSize }) => ({
  background: `linear-gradient(90deg, #303030 ${
    100 - depthSize
  }%, rgba(0,100,0,0.3) 0%)`,
}));

const BidsWidget = ({ bids, ...props }) => {
  return (
    <Grid item sm={6} xs={12} {...props}>
      <Grid container>
        <GridItem item xs={6} data-testid={COMPONENT_TEST_IDS.TOTAL}>
          TOTAL
        </GridItem>
        <GridItem item xs={6} data-testid={COMPONENT_TEST_IDS.SIZE}>
          SIZE
        </GridItem>
        <GridItem item xs={6} data-testid={COMPONENT_TEST_IDS.PRICE}>
          PRICE
        </GridItem>
      </Grid>
      {!isEmpty(bids) &&
        bids.map((entry, index) => (
          <DataContainer
            container
            key={index}
            data-testid={`${COMPONENT_TEST_IDS.ORDER_ROW}_${index}`}
            depthSize={calculateDepth(bids, entry, index)}
          >
            <GridItem item xs={6}>
              {entry[2]}
            </GridItem>
            <GridItem item xs={6}>
              {entry[1]}
            </GridItem>
            <GridItem item xs={6} price={true}>
              {formatPrice(entry[0])}
            </GridItem>
          </DataContainer>
        ))}
    </Grid>
  );
};

BidsWidget.propTypes = {
  bids: PropTypes.array,
};

export default BidsWidget;
