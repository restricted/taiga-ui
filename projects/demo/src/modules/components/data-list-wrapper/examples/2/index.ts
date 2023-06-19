import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';

@Component({
    selector: 'tui-data-list-wrapper-example-2',
    templateUrl: './index.html',
    changeDetection,
    encapsulation,
})
export class TuiDataListWrapperExample2 {
    readonly control = new FormControl();

    readonly items = [
        {name: 'John', surname: 'Cleese'},
        {name: 'Eric', surname: 'Idle'},
        {name: 'Graham', surname: 'Chapman'},
        {name: 'Michael', surname: 'Palin'},
        {name: 'Terry', surname: 'Gilliam'},
        {name: 'Terry', surname: 'Jones'},
    ];

    readonly stringify = (item: {name: string; surname: string}): string =>
        `${item.name} ${item.surname}`;
}
