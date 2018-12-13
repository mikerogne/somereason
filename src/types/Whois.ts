export interface Whois {
    nick: string
    user: string
    host: string
    realname: string
    channels: string[]
    server: string
    serverinfo: string
    operator: string
    account?: string
}
