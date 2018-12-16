// Obviously shortened versions. Just contains relevant type info.
// See API for all data: https://developers.giphy.com/docs/
export interface GiphyApiResponse {
    pagination: { total_count: number, count: number, offset: number }
    data: [{ url: string }]
}

export interface GiphyApi {
    search(
        options: { q: string, rating?: string, limit?: number },
        callback: (err: Error | null, resp: GiphyApiResponse) => void,
    ): void
}
