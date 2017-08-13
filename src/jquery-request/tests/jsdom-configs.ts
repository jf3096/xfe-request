import * as jsdom from 'jsdom';

const {JSDOM} = jsdom;
const {window} = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://jx3.xoyo.com/',
    referrer: 'http://jx3.xoyo.com/',
    contentType: 'text/html',
    userAgent: 'Mellblomenator/9000',
    includeNodeLocations: true
});
(global as any).window = window;
require('../dependency-lib/jquery-1.7.2.js');
(global as any).$ = (window as any).$;
(global as any).jQuery = (window as any).jQuery = (window as any).$;
(global as any).localStorage = {};
