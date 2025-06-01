import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { TELEGRAM_BOT_USERNAME } from '../../tokens/telegram-bot-username.token';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-add-bot-page',
    templateUrl: './add-bot.page.html',
    styleUrls: ['./add-bot.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
        MatStepper,
        MatStep,
        MatStepLabel,
        MatButton,
        MatStepperNext,
        MatStepperPrevious
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBotPage {
    protected readonly pageTitle: string = 'Инструкция: как подключить нашего бота для сбора данных';
    protected readonly botUsername: string = inject(TELEGRAM_BOT_USERNAME);
    protected readonly channelName: string = 'НазваниеВашегоКанала';
}
