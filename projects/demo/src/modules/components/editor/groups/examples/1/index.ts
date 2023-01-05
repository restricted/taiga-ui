import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TUI_EDITOR_EXTENSIONS, TuiEditorTool} from '@taiga-ui/addon-editor';
import {TuiDestroyService} from '@taiga-ui/cdk';

@Component({
    selector: `tui-editor-groups-example-1`,
    templateUrl: `./index.html`,
    providers: [
        TuiDestroyService,
        {
            provide: TUI_EDITOR_EXTENSIONS,
            useValue: [
                import(`@taiga-ui/addon-editor/extensions/starter-kit`).then(
                    ({StarterKit}) => StarterKit,
                ),
                import(`@tiptap/extension-placeholder`).then(({Placeholder}) =>
                    Placeholder.configure({
                        emptyNodeClass: `t-editor-placeholder`,
                        placeholder: `Type '/' for command`, // Notion like
                        includeChildren: true,
                    }),
                ),
                import(`@taiga-ui/addon-editor/extensions/group`).then(
                    ({createGroupExtension}) =>
                        createGroupExtension({nested: false, createOnEnter: true}),
                ),
            ],
        },
    ],
    encapsulation,
    changeDetection,
})
export class TuiEditorGroupExample1 {
    readonly builtInTools = [TuiEditorTool.Undo, TuiEditorTool.Group];

    control = new FormControl(``);

    constructor() {
        this.control.patchValue(
            `<div data-type="group"><p>This is a boring paragraph.</p></div><div data-type="group"><p>And another draggable paragraph.</p></div><div data-type="group"><p>Let’s finish with a boring paragraph.</p></div>`,
        );
    }
}
