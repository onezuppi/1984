import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface EditPostFormValue {
    content: string;
    attachments: string[];
}

export class EditPostForm extends FormGroup<{
    content: FormControl<string>;
    attachments: FormArray<FormControl<string>>;
}> {
    /** Доступ к контролам напрямую через свойства */
    readonly content: FormControl<string>;
    readonly attachments: FormArray<FormControl<string>>;

    constructor(private fb: FormBuilder, initial: EditPostFormValue) {
        super({
            content: fb.control(initial.content, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            attachments: fb.array(
                (initial.attachments || []).map(url =>
                    fb.control(url, { nonNullable: true })
                )
            )
        });

        // Привязываем контролы к публичным свойствам
        this.content = this.controls.content;
        this.attachments = this.controls.attachments;
    }

    /** Добавить URL вложения */
    addAttachment(url: string) {
        this.attachments.push(this.fb.control(url, { nonNullable: true }));
    }

    /** Удалить вложение по индексу */
    removeAttachment(index: number) {
        this.attachments.removeAt(index);
    }

    /** Собрать текущее значение формы */
    getValue(): EditPostFormValue {
        return {
            content: this.content.value,
            attachments: this.attachments.value
        };
    }
}
