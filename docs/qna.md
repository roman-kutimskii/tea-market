1. Где должна быть проверка на уникальность почты пользователя?

- Накинуть униклальный индекс на почту, потому что пользователь может поменять почту.

2. Нужно сделать поля unique и обрабатывать ошибку или искать в таблице?

- Добавляем запись, ловим исключение из репозитория и отправляем ответ.

3. Нужно ли реализовывать свой репозиторий или можно использовать из ORM?

- Можно использовать репозиторий из `typeorm` для простых запросов.
