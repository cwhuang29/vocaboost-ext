import Bowser from 'bowser';

const browserName = Bowser.getParser(window.navigator.userAgent).getBrowserName();

export const IS_CHROME = browserName === Bowser.BROWSER_MAP.chrome;
