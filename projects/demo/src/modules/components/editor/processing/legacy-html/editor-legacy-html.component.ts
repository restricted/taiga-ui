import {Component} from '@angular/core';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TuiDocExample} from '@taiga-ui/addon-doc';

@Component({
    selector: 'editor-legacy-html',
    templateUrl: './editor-legacy-html.component.html',
    encapsulation,
    changeDetection,
})
export class ExampleTuiEditorProcessingContentComponent {
    readonly example1: TuiDocExample = {
        TypeScript: import('./examples/1/index.ts?raw'),
        HTML: import('./examples/1/index.html?raw'),
        './transformer.ts': import('./examples/1/transformer.ts?raw'),
        './legacy-editor.ts': import(
            '../../../../../../../addon-editor/utils/legacy-converter.ts?raw'
        ),
    };
}
