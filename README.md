# AbitOnline

> Проект с хакатона "Цифровой Прорыв" в номинации "Государственное управление"

## Описание

Приложение `AbitOnline` - это self-hosted система приёма документов для поступления в ВУЗ. <br>
Концепт заключается в том, что все документы, отправляемые абитурой, загружаются на сервер в отсортированном виде. <br>
И с сервера можно настроить Network Share, чтобы шейрить папку между компьютерами приёмной комиссии.
Приёмная комиссия по поступившим документам находит баллы ЕГЭ и добавляет в базу данных. <br>
Ранжированные списки выводятся непосредственно в приложении и обновляются каждые 20 секунд. <br>
Дальнейшая обработка данных может быть осуществлена с помощью скриптов (например, отслеживание изменений в папке и рассылка писем).

## Что реализовано
* Интернационализация (i18n)
* Интерфейс (Vuetify)
* Вся основная механика и валидация форм
* Бэкенд
* Хранение состояния (Vuex)
* Роутинг (Vue Router)

## Как это выглядит

![main_en](https://user-images.githubusercontent.com/24318966/60133014-5308e280-97a5-11e9-8ee6-1c3db696465f.png)
![main_ru](https://user-images.githubusercontent.com/24318966/60133020-556b3c80-97a5-11e9-9ea2-fe125b2bf788.png)
![ranked_list](https://user-images.githubusercontent.com/24318966/60133025-57350000-97a5-11e9-82a4-c7093cfb2f87.png)
![full_size](https://user-images.githubusercontent.com/24318966/60133028-58fec380-97a5-11e9-9a5c-d549fd17dc4b.png)


## Как пощупац

1) `npm ci`

2) `npm start`
