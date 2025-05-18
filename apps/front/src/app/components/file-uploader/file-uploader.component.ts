import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-file-uploader',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatProgressSpinnerModule
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
export class FileUploaderComponent implements ControlValueAccessor, AfterViewInit {
    value: string[] | null = null;
    filename: string | null = null;
    files: File[] = [];
    disabled = false;
    isLoading: boolean = false;

    cdr = inject(ChangeDetectorRef);

    ngAfterViewInit(): void {
        if (!!this.value) {
            this.filename = this.getFileNameByB64(this.value);
            this.cdr.detectChanges();
        }
    }

    private onChange = (v: string[] | null) => {
    };
    private onTouched = () => {
    };

    writeValue(obj: string[] | null): void {
        this.value = obj;
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
            return;
        }
        this.isLoading = true;
        const fileArray = Array.from(input.files);
        forkJoin(fileArray.map(file => this.fileToBase64(file)))
            .pipe(
                take(1)
            )
            .subscribe({
                next: (base64: string[]) => {
                    this.files = fileArray;
                    this.filename = this.files.map(f => f.name).join(', ');
                    this.value = base64;

                    this.onChange(base64);
                    this.onTouched();
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.clear();
                    this.isLoading = false;
                }
            });
        input.value = '';
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
        this.files = [];
        this.onChange(null);
        this.onTouched();
        this.cdr.detectChanges();
    }

    private getFileNameByB64(files: string[]): string {
        return files.map((b64, idx) => `file${ idx + 1 }`).join(', ');
    }
}
