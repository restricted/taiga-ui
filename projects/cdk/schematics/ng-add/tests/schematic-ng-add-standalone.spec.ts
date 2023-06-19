/* eslint-disable rxjs/no-topromise */
import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {
    createProject,
    createSourceFile,
    resetActiveProject,
    saveActiveProject,
    setActiveProject,
} from 'ng-morph';
import {join} from 'path';

import {createAngularJson} from '../../utils/create-angular-json';
import {
    DOMPURIFY_TYPES_VERSION,
    DOMPURIFY_VERSION,
    NG_DOMPURIFY_VERSION,
    TAIGA_VERSION,
} from '../constants/versions';
import {TuiSchema} from '../schema';

const collectionPath = join(__dirname, `../../collection.json`);

describe(`ng-add [Standalone]`, () => {
    let host: UnitTestTree;
    let runner: SchematicTestRunner;

    beforeEach(() => {
        host = new UnitTestTree(new HostTree());
        runner = new SchematicTestRunner(`schematics`, collectionPath);

        setActiveProject(createProject(host));

        createSourceFile(
            `package.json`,
            `{"dependencies": {"@angular/core": "~13.0.0"}}`,
        );
        createAngularJson();
        createMainStandaloneFiles();
        saveActiveProject();
    });

    it(`should add main modules in package.json`, async () => {
        const options: TuiSchema = {
            addSanitizer: false,
            addGlobalStyles: false,
            addDialogsModule: false,
            addAlertModule: false,
            addons: [],
            project: ``,
            'skip-logs': process.env[`TUI_CI`] === `true`,
        };

        const tree = await runner.runSchematicAsync(`ng-add`, options, host).toPromise();

        expect(tree.readContent(`package.json`)).toEqual(
            `{
  "dependencies": {
    "@angular/core": "~13.0.0",
    "@taiga-ui/cdk": "${TAIGA_VERSION}",
    "@taiga-ui/core": "${TAIGA_VERSION}",
    "@taiga-ui/icons": "${TAIGA_VERSION}",
    "@taiga-ui/kit": "${TAIGA_VERSION}"
  }
}`,
        );
    });

    it(`should add additional modules in package.json`, async () => {
        const options: TuiSchema = {
            addSanitizer: true,
            addGlobalStyles: false,
            addDialogsModule: false,
            addAlertModule: false,
            addons: [`addon-doc`, `addon-mobile`],
            project: ``,
            'skip-logs': process.env[`TUI_CI`] === `true`,
        };

        const tree = await runner.runSchematicAsync(`ng-add`, options, host).toPromise();

        expect(tree.readContent(`package.json`)).toEqual(
            `{
  "devDependencies": {
    "@types/dompurify": "${DOMPURIFY_TYPES_VERSION}"
  },
  "dependencies": {
    "@angular/cdk": "^13.0.0",
    "@angular/core": "~13.0.0",
    "@taiga-ui/addon-doc": "${TAIGA_VERSION}",
    "@taiga-ui/addon-mobile": "${TAIGA_VERSION}",
    "@taiga-ui/cdk": "${TAIGA_VERSION}",
    "@taiga-ui/core": "${TAIGA_VERSION}",
    "@taiga-ui/icons": "${TAIGA_VERSION}",
    "@taiga-ui/kit": "${TAIGA_VERSION}",
    "@tinkoff/ng-dompurify": "${NG_DOMPURIFY_VERSION}",
    "dompurify": "${DOMPURIFY_VERSION}"
  }
}`,
        );
    });

    it(`should add additional modules in package.json and global styles`, async () => {
        const options: TuiSchema = {
            addSanitizer: true,
            addGlobalStyles: true,
            addDialogsModule: false,
            addAlertModule: false,
            addons: [`addon-doc`, `addon-mobile`],
            project: ``,
            'skip-logs': process.env[`TUI_CI`] === `true`,
        };

        const tree = await runner.runSchematicAsync(`ng-add`, options, host).toPromise();

        expect(tree.readContent(`package.json`)).toEqual(
            `{
  "devDependencies": {
    "@types/dompurify": "${DOMPURIFY_TYPES_VERSION}"
  },
  "dependencies": {
    "@angular/cdk": "^13.0.0",
    "@angular/core": "~13.0.0",
    "@taiga-ui/addon-doc": "${TAIGA_VERSION}",
    "@taiga-ui/addon-mobile": "${TAIGA_VERSION}",
    "@taiga-ui/cdk": "${TAIGA_VERSION}",
    "@taiga-ui/core": "${TAIGA_VERSION}",
    "@taiga-ui/icons": "${TAIGA_VERSION}",
    "@taiga-ui/kit": "${TAIGA_VERSION}",
    "@taiga-ui/styles": "${TAIGA_VERSION}",
    "@tinkoff/ng-dompurify": "${NG_DOMPURIFY_VERSION}",
    "dompurify": "${DOMPURIFY_VERSION}"
  }
}`,
        );
    });

    it(`should add assets and styles in angular.json`, async () => {
        const tree = await runner
            .runSchematicAsync(
                `ng-add-setup-project`,
                {'skip-logs': process.env[`TUI_CI`] === `true`} as Partial<TuiSchema>,
                host,
            )
            .toPromise();

        expect(tree.readContent(`angular.json`)).toEqual(`
{
  "version": 1,
  "defaultProject": "demo",
  "projects": {
    "demo": {
        "architect": {
          "build": {
            "options": {
              "main": "test/main.ts",
            "styles": [
              "node_modules/@taiga-ui/core/styles/taiga-ui-theme.less",
              "node_modules/@taiga-ui/core/styles/taiga-ui-fonts.less"
            ],
            "assets": [
              {
                "glob": "**/*",
                "input": "node_modules/@taiga-ui/icons/src",
                "output": "assets/taiga-ui/icons"
              }
            ]
            }
          }
        }
    }
  }
}`);
    });

    it(`should add styles without duplicates, taiga styles first`, async () => {
        createAngularJson({stylesExist: true});
        saveActiveProject();

        const tree = await runner
            .runSchematicAsync(
                `ng-add-setup-project`,
                {'skip-logs': process.env[`TUI_CI`] === `true`} as Partial<TuiSchema>,
                host,
            )
            .toPromise();

        expect(tree.readContent(`angular.json`)).toEqual(`
{
  "version": 1,
  "defaultProject": "demo",
  "projects": {
    "demo": {
        "architect": {
          "build": {
            "options": {
              "main": "test/main.ts",
            "styles": [
              "node_modules/@taiga-ui/core/styles/taiga-ui-theme.less",
              "node_modules/@taiga-ui/core/styles/taiga-ui-fonts.less",
              "some.style"
            ],
            "assets": [
              {
                "glob": "**/*",
                "input": "node_modules/@taiga-ui/icons/src",
                "output": "assets/taiga-ui/icons"
              }
            ]
                }
          }
        }
    }
  }
}`);
    });

    it(`should add global styles`, async () => {
        createAngularJson({stylesExist: true});
        saveActiveProject();

        const tree = await runner
            .runSchematicAsync(
                `ng-add-setup-project`,
                {addGlobalStyles: true} as Partial<TuiSchema>,
                host,
            )
            .toPromise();

        expect(tree.readContent(`angular.json`)).toEqual(`
{
  "version": 1,
  "defaultProject": "demo",
  "projects": {
    "demo": {
        "architect": {
          "build": {
            "options": {
              "main": "test/main.ts",
            "styles": [
              "node_modules/@taiga-ui/core/styles/taiga-ui-theme.less",
              "node_modules/@taiga-ui/core/styles/taiga-ui-fonts.less",
              "node_modules/@taiga-ui/styles/taiga-ui-global.less",
              "some.style"
            ],
            "assets": [
              {
                "glob": "**/*",
                "input": "node_modules/@taiga-ui/icons/src",
                "output": "assets/taiga-ui/icons"
              }
            ]
                }
          }
        }
    }
  }
}`);
    });

    it(`Should add Taiga-ui modules and providers to main component`, async () => {
        const options: TuiSchema = {
            addSanitizer: true,
            addGlobalStyles: false,
            addDialogsModule: true,
            addAlertModule: true,
            addons: [],
            project: ``,
            'skip-logs': process.env[`TUI_CI`] === `true`,
        };

        const tree = await runner
            .runSchematicAsync(`ng-add-setup-project`, options, host)
            .toPromise();

        expect(tree.readContent(`test/app/app.component.ts`)).toEqual(
            `import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule],
  selector: 'standalone-test-root',
  templateUrl: './app.template.html',
  styleUrls: ['./app.component.less'],
        providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}]
    })
export class AppComponent {
  title = 'standalone-test';
}`,
        );
    });

    it(`Should wrap main template with tui-root`, async () => {
        const tree = await runner
            .runSchematicAsync(
                `ng-add-setup-project`,
                {'skip-logs': process.env[`TUI_CI`] === `true`} as Partial<TuiSchema>,
                host,
            )
            .toPromise();

        expect(tree.readContent(`test/app/app.template.html`)).toEqual(`<tui-root>
<app></app>
</tui-root>`);
    });

    it(`[Standalone] Should add main providers to bootstrap fn`, async () => {
        const tree = await runner
            .runSchematicAsync(
                `ng-add-setup-project`,
                {'skip-logs': process.env[`TUI_CI`] === `true`} as Partial<TuiSchema>,
                host,
            )
            .toPromise();

        expect(tree.readContent(`test/main.ts`))
            .toEqual(`import { importProvidersFrom } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()), importProvidersFrom(SomeModule, TuiRootModule, BrowserAnimationsModule)],
}).catch((err) => console.error(err));
`);
    });

    afterEach(() => {
        resetActiveProject();
    });
});

function createMainStandaloneFiles(): void {
    createSourceFile(
        `test/main.ts`,
        `import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()), importProvidersFrom(SomeModule)],
}).catch((err) => console.error(err));
`,
    );

    createSourceFile(
        `test/app/app.component.ts`,
        `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'standalone-test-root',
  templateUrl: './app.template.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'standalone-test';
}`,
    );

    createSourceFile(`test/app/app.template.html`, `<app></app>`);
}
