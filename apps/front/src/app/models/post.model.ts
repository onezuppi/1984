export interface Post {
    id: string;
    channelId: string;
    /** Основной текст сообщения */
    content: string;
    /** Ссылки на вложенные изображения, если есть */
    attachments?: string[];
    /** Назначается системой позже */
    timestamp?: Date;
}
