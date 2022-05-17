const IOS_REG_EXP = /ipad|iphone|ipod/;

export function isIos(navigator: Navigator): boolean {
    const userAgent = navigator.userAgent.toLowerCase();

    return (
        IOS_REG_EXP.test(userAgent) ||
        (userAgent.includes('apple') && navigator.maxTouchPoints > 1)
    );
}
