export interface BotOptions {
    nickname: string
    realName: string
    userName: string
    password: string
    server: string
    port: number
    localAddress: any
    debug: boolean
    showErrors: boolean
    channels: []
    autoConnect: boolean
    autoRejoin: boolean
    autoRenick: boolean
    renickCount: any
    renickDelay: number
    retryCount: any
    retryDelay: number
    secure: boolean
    selfSigned: boolean
    certExpired: boolean
    floodProtection: boolean
    floodProtectionDelay: number
    sasl: boolean
    webirc: {
        pass: string,
        ip: string,
        host: string,
    },
    stripColors: boolean
    channelPrefixes: string
    messageSplit: number
    encoding: string | null
    millisecondsOfSilenceBeforePingSent: number
    millisecondsBeforePingTimeout: number
    enableStrictParse: boolean
}
