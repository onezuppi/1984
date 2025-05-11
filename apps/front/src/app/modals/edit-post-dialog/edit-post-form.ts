import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface EditPostFormValue {
    content: string;
    attachments: string[];
}

export class EditPostForm extends FormGroup<{
    content: FormControl<string>;
    attachments: FormArray<FormControl<string>>;
}> {
    /** Контрол для содержимого поста */
    readonly content: FormControl<string>;
    /** Массив контролов для Base64-строк вложений */
    readonly attachments: FormArray<FormControl<string>>;

    constructor(private fb: FormBuilder, initial: EditPostFormValue) {
        super({
            content: fb.control(initial.content, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            attachments: fb.array(
                (initial.attachments || []).map(b64 =>
                    fb.control(b64, { nonNullable: true })
                )
            )
        });

        this.content = this.controls.content;
        this.attachments = this.controls.attachments;
    }

    /**
     * Собрать текущее значение формы
     */
    getValue(): EditPostFormValue {
        return {
            content: this.content.value,
            attachments: this.attachments.value
        };
    }
}
