import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { API, graphqlOperation } from 'aws-amplify'
import { getUser } from '../graphql/queries'
// import { Notification, Message } from "element-react";

import { createOrder } from '../graphql/mutations'
import { Notification, Message } from 'element-react'
import { history } from '../App'

const stripeConfig = {
  currency: 'USD',
  publishableAPIKey: 'pk_test_z2Cd2p11YtjqGdo1NlGPCqS6'
}

const PayButton = ({ product, user }) => {

  const getOwnerEmail = async ownerId => {
    console.log("owner ID is " + ownerId);
    try {
      const input = { id: ownerId }
      const result = await API.graphql(graphqlOperation(getUser, input))
      return result.data.getUser.email
    } catch (err) {
      console.error(`Error fetching product owner's email: ${err}`)
    }
  }

  const handleCharge = async token => {
    
    try {
      const ownerEmail = await getOwnerEmail(product.owner)
      console.log(ownerEmail)
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description
          },
          email: {
            customerEmail: user.attributes.email,
            ownerEmail,
            shipped: product.shipped
          }
        }
      })
      console.log({ result })
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <StripeCheckout
      token={handleCharge}
      email={user.attributes.email}
      name={product.description}
      amount={product.price}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      local='auto'
      allowRememberMe={false}
    />
  )
}

export default PayButton
