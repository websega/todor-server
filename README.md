## Todor -  app for your to-do list

Приложение для составления списка дел.

[Репозиторий с клиентской частью](https://github.com/websega/todor-client.git)

#### Scripts server
- Install packages    ```npm i```
- Start server        ```npm run start```
- Start nodemon     ```npm run dev```
- Compile build    ```npm run build```

Для конфигурации сервера в папке `config` необходимо создать файл `default.json`:

```json
{
  "serverPort": 5000,
  "dbUrl": "вставьте сюда connection string из диалога подключения к кластеру",
  "secretKey": "произвольный секретный ключ",
  "staticPath": "G:\\path\\server\\static"
}
```
