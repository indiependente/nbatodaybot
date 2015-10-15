// An example for OpenShift platform.
var TelegramBot = require('node-telegram-bot-api'),
	request = require('request'),
	moment = require('moment')

var token = require('fs').readFileSync('tokenFile').toString()

// See https://developers.openshift.com/en/node-js-environment-variables.html
var port = process.env.OPENSHIFT_NODEJS_PORT
var host = process.env.OPENSHIFT_NODEJS_IP
var domain = process.env.OPENSHIFT_APP_DNS

var bot = new TelegramBot(token, {webHook: {port: port, host: host}})
// OpenShift enroutes :443 request to OPENSHIFT_NODEJS_PORT
bot.setWebHook(domain+':443/bot'+token)

bot.onText(/\/help/, function (msg)
{
	bot.sendMessage(msg.chat.id, 'Hello, I am NBA Today Bot.\nType "/scores" to get the latest results from the NBA championship.')
})

bot.onText(/\/scores/, function (msg)
{
	var chatId = msg.chat.id
	request('http://nbastaz-indiependente.rhcloud.com/matches?date='+moment().subtract({days:1}).format('MM-DD-YYYY'),
		function (error, response, body)
		{
			body = JSON.parse(body)
			var scores = ''
			for (m in body)
			{
				if (body[m].vteam.name.indexOf('L.A.') > -1)
					body[m].vteam.name = 'L.A.'
				if (body[m].hteam.name.indexOf('L.A.') > -1)
					body[m].hteam.name = 'L.A.'
				scores += body[m].vteam.name + ' ' + capitalize(body[m].vteam.abbr) + ' ' +
					body[m].vteam.finl + ' - ' + body[m].hteam.name + ' ' + capitalize(body[m].hteam.abbr) + ' ' +
					body[m].hteam.finl + '\n'
			}
			bot.sendMessage(chatId, scores)
		}
	)
})

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}