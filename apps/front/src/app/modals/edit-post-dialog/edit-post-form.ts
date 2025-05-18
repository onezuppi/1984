import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface EditPostFormValue {
    content: string;
    attachments: string[] | null;
}

export class EditPostForm extends FormGroup<{
    content: FormControl<string>;
    attachments: FormControl<string[] | null>;
}> {
    /** Контрол для содержимого поста */
    readonly content: FormControl<string>;
    /** Массив контролов для Base64-строк вложений */
    readonly attachments: FormControl<string[] | null>;

    constructor(private fb: FormBuilder, initial: EditPostFormValue) {
        super({
            content: fb.control(initial.content, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            attachments: fb.control(initial.attachments || [], {
                nonNullable: false,
            }),
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
