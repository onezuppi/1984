import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

@Component({
    selector: 'app-add-bot-page',
    templateUrl: './add-bot.page.html',
    styleUrls: ['./add-bot.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatList,
        MatListItem,
        MatCard,
        MatCardContent,
        MatAccordion,
        MatToolbar,
        PageLayoutComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBotPage {
    protected readonly pageTitle: string = 'Инструкция: как подключить нашего бота для сбора данных';
    protected readonly botUsername: string = '@YourBotUsername';
    protected readonly channelName: string = 'НазваниеВашегоКанала';
}
