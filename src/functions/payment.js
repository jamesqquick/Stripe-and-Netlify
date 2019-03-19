require("dotenv").config();

var stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.handler = function(event, context, callback) {
  console.log(event.body);
  console.log("*****************");

  const vars = event.body.split("&").reduce((acc, cur) => {
    const key = cur.split("=")[0];
    const val = cur.split("=")[1];
    acc[key] = decodeURIComponent(val);
    return acc;
  }, {});
  console.log(vars);

  //const parsedBody = JSON.parse(event.body);
  //console.log(parsedBody);
  // create a customer, create the charge for that customer
  stripe.customers
    .create({
      email: vars.stripeEmail,
      card: vars.stripeToken
    })
    .then(customer => {
      return stripe.charges.create({
        amount: 300,
        description: "Test Charge",
        currency: "usd",
        customer: customer.id
      });
    })
    .then(charge => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(charge)
      });
    })
    .catch(err => {
      console.error(err);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({ msg: "Failed to process payment" })
      });
    });
};
