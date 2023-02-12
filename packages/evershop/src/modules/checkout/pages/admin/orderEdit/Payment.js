import PropTypes from 'prop-types';
import React from 'react';
import Area from '../../../../../lib/components/Area';
import Circle from '../../../../../lib/components/Circle';
import { Card } from '../../../../cms/components/admin/Card';
import './Payment.scss';
import { Discount } from './payment/Discount';
import { Shipping } from './payment/Shipping';
import { SubTotal } from './payment/SubTotal';
import { Tax } from './payment/Tax';
import { Total } from './payment/Total';
import { Transactions } from './payment/Transactions';

export default function OrderSummary({
  order: {
    orderId,
    coupon,
    shippingMethod,
    paymentMethodName,
    totalQty,
    taxAmount,
    discountAmount,
    grandTotal,
    subTotal,
    shippingFeeExclTax,
    currency,
    paymentStatus,
    transactions
  }
}) {
  return (
    <Card
      title={
        <div className="flex space-x-1">
          <Circle variant={paymentStatus.badge} />
          <span className="block self-center">
            {paymentMethodName || 'Unknown'}
          </span>
        </div>
      }
    >
      <Card.Session>
        <Area
          id="orderSummaryBlock"
          orderId={orderId}
          currency={currency}
          grandTotal={grandTotal}
          coupon={coupon}
          discountAmount={discountAmount}
          taxAmount={taxAmount}
          className="summary-wrapper"
          coreComponents={[
            {
              component: { default: SubTotal },
              props: { count: totalQty, total: subTotal.text },
              sortOrder: 5
            },
            {
              component: { default: Shipping },
              props: { method: shippingMethod, cost: shippingFeeExclTax.text },
              sortOrder: 10
            },
            {
              component: { default: Discount },
              props: { code: coupon, discount: discountAmount.text },
              sortOrder: 15
            },
            {
              component: { default: Tax },
              props: { taxClass: '', amount: taxAmount.text },
              sortOrder: 20
            },

            {
              component: { default: Total },
              props: { total: grandTotal.text },
              sortOrder: 30
            }
          ]}
        />
      </Card.Session>
      <Card.Session>
        <Transactions transactions={transactions} />
      </Card.Session>
      <Area id="orderPaymentActions" noOuter />
    </Card>
  );
}

OrderSummary.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    totalQty: PropTypes.number.isRequired,
    coupon: PropTypes.string,
    shippingMethod: PropTypes.string,
    paymentMethodName: PropTypes.string,
    taxAmount: PropTypes.shape({
      text: PropTypes.string.isRequired
    }).isRequired,
    discountAmount: PropTypes.shape({
      text: PropTypes.string.isRequired
    }).isRequired,
    grandTotal: PropTypes.shape({
      text: PropTypes.string.isRequired
    }).isRequired,
    subTotal: PropTypes.shape({
      text: PropTypes.string.isRequired
    }).isRequired,
    shippingFeeExclTax: PropTypes.shape({
      text: PropTypes.string.isRequired
    }).isRequired,
    currency: PropTypes.string.isRequired,
    paymentStatus: PropTypes.shape({
      code: PropTypes.string,
      badge: PropTypes.string,
      progress: PropTypes.number,
      name: PropTypes.string
    }).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        paymentTransactionId: PropTypes.string.isRequired,
        amount: PropTypes.shape({
          text: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired
        }).isRequired,
        paymentAction: PropTypes.string.isRequired,
        transactionType: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export const layout = {
  areaId: 'leftSide',
  sortOrder: 20
};

export const query = `
  query Query {
    order(id: getContextValue("orderId")) {
      orderId
      totalQty
      coupon
      shippingMethod
      paymentMethod
      paymentMethodName
      taxAmount {
        text(currency: getContextValue("orderCurrency"))
      }
      discountAmount {
        text(currency: getContextValue("orderCurrency"))
      }
      grandTotal {
        text(currency: getContextValue("orderCurrency"))
      }
      subTotal {
        text(currency: getContextValue("orderCurrency"))
      }
      shippingFeeExclTax {
        text(currency: getContextValue("orderCurrency"))
      }
      currency
      paymentStatus {
        code
        badge
        progress
        name
      }
      transactions: paymentTransactions {
        paymentTransactionId
        amount {
          text(currency: getContextValue("orderCurrency"))
          value
        }
        paymentAction
        transactionType
      }
    }
  }
`;
