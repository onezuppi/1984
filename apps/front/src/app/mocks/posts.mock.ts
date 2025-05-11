// src/app/mocks/posts.mock.ts

import { Post } from '../models/post.model';

export const POSTS_MOCK: Post[] = [
    {
        id: '1',
        channelId: '1',
        content: `Обновление Angular 15 вышло! Теперь можно создавать standalone-компоненты без NgModule, а CLI получил новые полезные флаги.`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    },
    {
        id: '2',
        channelId: '1',
        content: `Тестирование в Angular:  
1. Устанавливаем Jasmine и Karma  
2. Конфигурируем karma.conf.js  
3. Пишем первые unit-тесты для компонентов и сервисов`,
    },
    {
        id: '3',
        channelId: '2',
        content: `RxJS-лайфхак:  
- switchMap отменяет предыдущие подписки  
- mergeMap запускает все параллельно  
- concatMap выполняет по очереди`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    },
    {
        id: '4',
        channelId: '2',
        content: `ReactiveForms vs TemplateForms:  
• ReactiveForms для динамических форм  
• TemplateForms для простых сценариев  
• Кастомные валидаторы и асинхронная валидация`
    },
    {
        id: '5',
        channelId: '3',
        content: `Кастомизация темы в Angular Material:  
1. Переопределяем SCSS-переменные  
2. Создаём light/dark темы  
3. Подключаем шрифты и иконки`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    },
    {
        id: '6',
        channelId: '3',
        content: `CDK Overlay:  
- Overlay для модалей  
- PositionStrategy для позиционирования  
- Хуки для автозакрытия`
    },
    {
        id: '7',
        channelId: '4',
        content: `NLP-анализ в браузере:  
• Интеграция с TensorFlow.js  
• Токенизация и лемматизация  
• Классификация тональности`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    },
    {
        id: '8',
        channelId: '4',
        content: `Email-рассылка через сервер:  
1. Настраиваем эндпоинт на бэкенде  
2. Используем HttpClient в Angular  
3. Обрабатываем ошибки и показываем уведомления`
    },
    {
        id: '9',
        channelId: '5',
        content: `TypeScript 5: ключевые новинки:  
- Улучшенные условные типы  
- Шаблонные литералы как типы  
- Новые утилиты в стандартной библиотеке`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    },
    {
        id: '10',
        channelId: '5',
        content: `Оптимизация бандла:  
• Lazy loading модулей  
• Webpack Bundle Analyzer  
• Удаление dead code`
    },
    {
        id: '11',
        channelId: '1',
        content: `Рефакторинг сервиса:  
- Выделяем общую логику в базовый класс  
- Используем InjectionToken для конфигурации  
- Покрываем ключевые методы тестами`
    },
    {
        id: '12',
        channelId: '2',
        content: `WebSocket в Angular:  
1. RxJS WebSocketSubject  
2. Реконнект и heartbeat  
3. Управление потоками`
    },
    {
        id: '13',
        channelId: '3',
        content: `Скрытые команды Angular CLI:  
• ng generate interface  
• ng config projects  
• ng add @schematics/angular`
    },
    {
        id: '14',
        channelId: '4',
        content: `Метрики вовлечённости:  
- Время чтения  
- Количество реакций  
- Dwell time`
    },
    {
        id: '15',
        channelId: '5',
        content: `Новая маршрутизация:  
• loadComponent для lazy loading  
• Data resolvers  
• Предзагрузка модулей`,
        attachments: ['https://cdn-icons-png.flaticon.com/512/25/25333.png', 'https://cdn-icons-png.flaticon.com/512/25/25333.png']
    }
];
