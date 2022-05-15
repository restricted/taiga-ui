import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {TuiPrimitiveTextfieldModule} from '@taiga-ui/core/components';
import {configureTestSuite, NativeInputPO, tuiEmulateAutoFill} from '@taiga-ui/testing';

describe('TuiAutofillModule and TuiPrimitiveTextfield', () => {
    @Component({
        template: `
            <tui-primitive-textfield
                [(value)]="value"
                (autofilledChange)="autofilled = $event"
            ></tui-primitive-textfield>
        `,
    })
    class TestComponent {
        value = '';
        autofilled = false;
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let inputPO: NativeInputPO;

    configureTestSuite(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, TuiPrimitiveTextfieldModule],
            declarations: [TestComponent],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
        inputPO = new NativeInputPO(fixture, `tui-primitive-textfield__native-input`);
    });

    it('correctly works if `tuiAutofilledChange` is set to `tui-wrapper`', () => {
        expect(testComponent.autofilled).toBeFalse();
        expect(testComponent.value).toBe('');

        expect(getWrapperClassList(fixture)).toEqual([
            'tui-autofill',
            '_no-hover',
            '_no-active',
        ]);

        tuiEmulateAutoFill(inputPO.nativeElement, '1111 2222 3333 4444');
        fixture.detectChanges();

        expect(getWrapperClassList(fixture)).toEqual([
            'tui-autofill',
            '_no-hover',
            '_no-active',
            '_autofilled',
        ]);

        expect(testComponent.autofilled).toBeTrue();
        expect(testComponent.value).toBe('1111 2222 3333 4444');

        tuiEmulateAutoFill(inputPO.nativeElement);
        fixture.detectChanges();

        expect(getWrapperClassList(fixture)).toEqual([
            'tui-autofill',
            '_no-hover',
            '_no-active',
        ]);

        expect(testComponent.autofilled).toBeFalse();
        expect(testComponent.value).toBe('');
    });
});

function getWrapperClassList<T>(fixture: ComponentFixture<T>): string[] {
    return Array.from(
        fixture.nativeElement.querySelector('tui-wrapper')?.classList || [],
    );
}
