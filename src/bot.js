const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  welcome(session)
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'adult':
      adult(session)
      break
    case 'child':
      child(session)
      break
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {
  session.reply(SOFA.Message({
  body: 'Hello, welcome to Gift Bot! I am here to help you find the perfect gift.',
  controls: [
      {type: 'button', label: 'Adult', value: 'adult'},
      {type: 'button', label: 'Child', value: 'child'}
    ],
  showKeyboard: false,
  }))
}

function pong(session) {
  sendMessage(session, `Pong`)
}

// Adult Session 

function adult(session){
  session.reply(SOFA.Message({
  body: 'Choose a category.',
  controls:[
      {type: 'button', label: 'Tech', value: 'tech'},
      {type: 'button', label: 'Fashion', value:'fashion'}
  ],
  showKeyboard: false,
  }))
}

//Child Session

function child(session){
  session.reply(SOFA.Message({
  body: 'Choose a category.',
  controls:[
      {type: 'button', label: 'Tech', value: 'tech'},
      {type: 'button', label: 'Fashion', value: 'fashion'}
  ],
  showKeyboard: false,
  }))
}

/*

// example of how to store state on each user
function count(session) {
  let count = (session.get('count') || 0) + 1
  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}
*/

// HELPERS

function sendMessage(session, message, entry) {
  let controls = [
    {type: 'button', label: 'Exit', value: 'exit'}   
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
