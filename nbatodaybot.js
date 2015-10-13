// An example for OpenShift platform.
var TelegramBot = require('node-telegram-bot-api')

var token = '34472327:AAGVb9yOxfABeSrSPiJ69REJZevi41fCgtI'
// See https://developers.openshift.com/en/node-js-environment-variables.html
var port = process.env.OPENSHIFT_NODEJS_PORT
var host = process.env.OPENSHIFT_NODEJS_IP
var domain = process.env.OPENSHIFT_APP_DNS

var bot = new TelegramBot(token, {webHook: {port: port, host: host}})
// OpenShift enroutes :443 request to OPENSHIFT_NODEJS_PORT
bot.setWebHook(domain+':443/bot'+token)
bot.on('message', function (msg) {
	var chatId = msg.chat.id
	bot.sendMessage(chatId, "I'm alive!")
})