import {enableProdMode, NgModuleRef} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgZoneOptionsCoalescing} from '@demo/emulate/ng-zone-options';

import {environment} from './environments/environment';
import {AppBrowserModule} from './modules/app/app.browser.module';

if (environment.production) {
    enableProdMode();
}

const bootstrap = async (): Promise<NgModuleRef<AppBrowserModule>> =>
    platformBrowserDynamic().bootstrapModule(AppBrowserModule, NgZoneOptionsCoalescing);

document.addEventListener(`DOMContentLoaded`, () => {
    setTimeout(() => {
        bootstrap().catch(err => console.error(err));
    });
});
