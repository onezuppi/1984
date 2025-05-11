import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-file-uploader',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploaderComponent),
            multi: true,
        },
    ],
})
export class FileUploaderComponent implements ControlValueAccessor {
    value: string | null = null;
    filename: string | null = null;
    disabled = false;

    private onChange = (v: string | null) => {
    };
    private onTouched = () => {
    };

    writeValue(obj: string | null): void {
        this.value = obj;
        this.filename = obj ? 'Выбран файл' : null;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            this.clear();
            return;
        }
        const file = input.files![0];
        this.filename = file.name;

        this.fileToBase64(file).subscribe({
            next: (base64: string) => {
                this.onChange(base64);
                this.onTouched();
            },
            error: () => this.clear()
        });
    }

    private fileToBase64(file: File): Observable<string> {
        return new Observable<string>((subscriber) => {
            const reader = new FileReader();
            reader.onload = () => {
                subscriber.next(reader.result as string);
                subscriber.complete();
            };
            reader.onerror = (err) => subscriber.error(err);
            reader.readAsDataURL(file);
        });
    }

    clear(): void {
        this.value = null;
        this.filename = null;
        this.onChange(null);
        this.onTouched();
    }
}
