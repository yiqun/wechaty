/**
 *
 * Wechaty - Wechat for Bot
 *
 * Connecting ChatBots
 * https://github.com/wechaty/wechaty
 *
 */

/* tslint:disable:variable-name */
const QrcodeTerminal  = require('qrcode-terminal')
const finis           = require('finis')

import {
  Config,
  Wechaty,
  log,
  MediaMessage,
} from '../'

const welcome = `
| __        __        _           _
| \\ \\      / /__  ___| |__   __ _| |_ _   _
|  \\ \\ /\\ / / _ \\/ __| '_ \\ / _\` | __| | | |
|   \\ V  V /  __/ (__| | | | (_| | |_| |_| |
|    \\_/\\_/ \\___|\\___|_| |_|\\__,_|\\__|\\__, |
|                                     |___/

=============== Powered by Wechaty ===============
-------- https://github.com/zixia/wechaty --------

I'm a bot, my super power is talk in Wechat.

If you send me a 'ding', I will reply you a 'dong'!
__________________________________________________

Hope you like it, and you are very welcome to
upgrade me for more super powers!

Please wait... I'm trying to login in...

`

console.log(welcome)
const bot = Wechaty.instance({ profile: Config.DEFAULT_PROFILE })

bot
.on('logout'	, user => log.info('Bot', `${user.name()} logouted`))
.on('login'	  , user => {
  log.info('Bot', `${user.name()} logined`)
  bot.say('Wechaty login')
})
.on('error'   , e => {
  log.info('Bot', 'error: %s', e)
  bot.say('Wechaty error: ' + e.message)
})
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    QrcodeTerminal.generate(loginUrl)
  }
  console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
.on('message', async m => {
  try {
    const room = m.room()
    console.log((room ? '[' + room.topic() + ']' : '')
                + '<' + m.from().name() + '>'
                + ':' + m.toStringDigest(),
    )

    if (/^(ding|ping|bing|code)$/i.test(m.content()) && !m.self()) {
      m.say('dong')
      log.info('Bot', 'REPLY: dong')

      const joinWechaty =  `Join Wechaty Developers' Community\n\n` +
                            `Wechaty is used in many ChatBot projects by hundreds of developers.\n\n` +
                            `If you want to talk with other developers, just scan the following QR Code in WeChat with secret code: wechaty,\n\n` +
                            `you can join our Wechaty Developers' Home at once`
      await m.say(joinWechaty)
      await m.say(new MediaMessage(__dirname + '/../image/BotQrcode.png'))
      await m.say('Scan now, because other Wechaty developers want to talk with you too!\n\n(secret code: wechaty)')
      log.info('Bot', 'REPLY: Image')
    }
  } catch (e) {
    log.error('Bot', 'on(message) exception: %s' , e)
  }
})

bot.init()
.catch(e => {
  log.error('Bot', 'init() fail: %s', e)
  bot.quit()
  process.exit(-1)
})

finis((code, signal) => {
  const exitMsg = `Wechaty exit ${code} because of ${signal} `
  console.log(exitMsg)
  bot.say(exitMsg)
})
