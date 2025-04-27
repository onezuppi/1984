import { Component } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { TuiLink, TuiNotification } from '@taiga-ui/core';

@Component({
    selector: 'app-add-bot-instruction',
    templateUrl: './add-bot-instruction.component.html',
    styleUrls: ['./add-bot-instruction.component.scss'],
    standalone: true,
    imports: [
        TuiAccordion,
        TuiNotification,
        TuiLink,
    ]
})
export class AddBotInstructionComponent {}
