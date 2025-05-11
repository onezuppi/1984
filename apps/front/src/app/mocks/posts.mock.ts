// src/app/mocks/posts.mock.ts

import { Post } from '../models/post.model';

export const POSTS_MOCK: Post[] = [
    {
        id: '1',
        channelId: '1',
        title: 'Обновление Angular 15: Что нового?',
        content: `В этом выпуске мы рассмотрим ключевые возможности Angular 15:
- Standalone компоненты без NgModule
- Улучшения в производительности рендеринга
- Новые утилиты в CLI и многое другое.`
    },
    {
        id: '2',
        channelId: '2',
        title: 'Как настроить Angular Material в вашем проекте',
        content: `Шаги по интеграции:
1. Установите пакеты: @angular/material, @angular/cdk, @angular/animations  
2. Импортируйте BrowserAnimationsModule в AppModule  
3. Подключите темы и иконочный шрифт в angular.json`
    },
    {
        id: '3',
        channelId: '2',
        title: 'Руководство по RxJS: операторы высшего порядка',
        content: `Вы узнаете:
- Что такое switchMap, mergeMap и concatMap  
- Когда использовать каждый из них  
- Примеры кода для обработки API-запросов и пользовательских событий`
    },
    {
        id: '4',
        channelId: '3',
        title: 'Telegram-шаблоны для постов: стиль и структура',
        content: `Рекомендуемая структура:
1. Заголовок в формате h3  
2. Основной текст до 200 символов  
3. Ссылки или кнопки внизу карточки  
4. Используйте иконки для визуального акцента`
    },
    {
        id: '5',
        channelId: '4',
        title: 'Анализ пользовательских каналов: первые шаги',
        content: `План анализа:
- Сбор метрик вовлечённости  
- Оценка частоты публикаций  
- Автоматическое распознавание тем постов с помощью NLP`
    }
];
