// https://node-irc-upd.readthedocs.io/en/latest/API.html#'raw'
export interface Message {
    prefix: string
    nick: string
    user: string
    host: string
    server: string
    rawCommand: string
    command: string
    commandType: string
    args: string[]
}
