import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';

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
        MatToolbar
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBotPage {
    botUsername = '@YourBotUsername';
    channelName = 'НазваниеВашегоКанала';
}
