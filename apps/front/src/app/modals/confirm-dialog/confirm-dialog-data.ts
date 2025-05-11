/** Данные, передаваемые в ConfirmDialogComponent */
export interface ConfirmDialogData {
    /** Заголовок окна */
    title: string;
    /** Основной текст сообщения */
    message: string;
    /** Текст кнопки подтверждения (по умолчанию "OK") */
    confirmText?: string;
    /** Текст кнопки отмены (по умолчанию "Отмена") */
    cancelText?: string;
}
