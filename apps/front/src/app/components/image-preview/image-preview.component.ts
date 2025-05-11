import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ImageDialogComponent } from '../../modals/image-dialog/image-dialog.component';


@Component({
    selector: 'app-image-preview',
    standalone: true,
    imports: [
        CommonModule,
        MatGridListModule,
        MatDialogModule,
        MatIconModule,
        MatCardModule
    ],
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePreviewComponent {
    @Input() images: string[] = [];

    constructor(private dialog: MatDialog) {}

    openPreview(src: string) {
        this.dialog.open(ImageDialogComponent, {
            data: { src },
            panelClass: 'image-dialog-panel'
        });
    }
}

