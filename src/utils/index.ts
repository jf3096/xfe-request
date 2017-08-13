import * as joinUrl from 'url-join';

export default class Utils {
    /**
     * 用于连接url的多个部分
     * @param {string} urls
     */
    public static joinUrl(...urls: string[]): void {
        for (const key in urls) {
            if (urls[key].indexOf('./') > -1 || urls[key].indexOf('../') > -1) {
                throw new Error(`Utils/index.ts: joinUrl不支持./或../`);
            }
        }
        return joinUrl.apply(null, urls);
    }
}
