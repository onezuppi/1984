import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditPostForm, EditPostFormValue } from '../../forms/edit-post-form';

@Injectable({ providedIn: 'root' })
export class EditPostDialogManagerService {
    form!: EditPostForm;
    loading = true;

    constructor(private fb: FormBuilder) {}

    /**
     * Инициализирует форму и эмулирует загрузку (показывает скелетон).
     */
    init(data: EditPostFormValue, delayMs = 500): void {
        this.loading = true;
        setTimeout(() => {
            this.form = new EditPostForm(this.fb, {
                content: data.content,
                attachments: data.attachments
            });
            this.loading = false;
        }, delayMs);
    }

    /** Обработка добавления файла */
    addAttachmentFromFileInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.form.addAttachment(reader.result as string);
            };
            reader.readAsDataURL(input.files![0]);
            input.value = '';
        }
    }

    /** Удаляет вложение */
    removeAttachment(index: number): void {
        this.form.removeAttachment(index);
    }

    /** Собирает итоговый объект для сохранения */
    getResult(postId: string): { postId: string } & EditPostFormValue {
        const val = this.form.getValue();
        return { postId, content: val.content, attachments: val.attachments };
    }
}
