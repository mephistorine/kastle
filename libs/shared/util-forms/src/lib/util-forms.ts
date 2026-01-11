import {toSignal} from "@angular/core/rxjs-interop";
import {AbstractControl} from "@angular/forms";
import {map, startWith} from "rxjs";

export function createControlRawValueSignal<T, R extends T>(
    control: AbstractControl<T, R>,
) {
    return toSignal<R>(
        control.valueChanges.pipe(
            startWith(control.getRawValue()),
            map(() => control.getRawValue()),
        ),
        {requireSync: true},
    );
}
