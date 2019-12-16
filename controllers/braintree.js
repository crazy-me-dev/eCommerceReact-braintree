const braintree = require("braintree");
const keys = require("../config/keys");

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: keys.merchantId,
  publicKey: keys.publicKey,
  privateKey: keys.privateKey
});

exports.generateBraintreeToken = async (req, res) => {
  const response = await gateway.clientToken.generate({});
  res.send(response);
};
exports.processPayment = async (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amountFromClient = req.body.amount;

  const data = await gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  });

  res.json(data);
};
