import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

interface GeneratedPost {
    id: number;
    title: string;
    content: string;
    tags: string[];
}

const mockPosts: GeneratedPost[] = [
    {
        id: 1,
        title: 'Новая коллекция весна 2025',
        content: 'Представляем нашу новую коллекцию одежды для весны 2025 года. Яркие цвета и современные фасоны ждут вас!',
        tags: ['мода', 'весна2025', 'новинки']
    },
    {
        id: 2,
        title: 'Скидки на электронику до 30%',
        content: 'Только до конца месяца — скидки до 30% на всю электронику в нашем магазине. Успейте приобрести по выгодным ценам!',
        tags: ['скидки', 'электроника', 'акция']
    },
    {
        id: 3,
        title: '5 советов по уходу за кожей летом',
        content: 'Лето — время особого ухода за кожей. Делимся пятью простыми советами, которые помогут сохранить вашу кожу здоровой и сияющей.',
        tags: ['уходзакожей', 'лето', 'советы']
    }
];

@Component({
    selector: 'add-post-page',
    templateUrl: './add-post.page.html',
    styleUrls: ['./add-post.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatChip,
        MatCardContent,
        MatCardActions,
        MatFormField,
        MatLabel,
        MatToolbar,
        MatProgressSpinner,
        FormsModule,
        MatIcon,
        MatHeaderCellDef,
        MatCellDef,
        MatInput,
        MatLabel,
        MatIconButton,
        MatHeaderRowDef,
        MatRowDef,
    ]
})
export class AddPostPage {
    isLoading: boolean = false;
    groupId = '';
    generatedPosts: GeneratedPost[] = mockPosts;

    constructor() {
    }

    generatePosts() {
        if (!this.groupId) return;
    }

}
