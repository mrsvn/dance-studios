
## Как запускать

1. Сервер MongoDB:

   ```bash
   $ mkdir -p mongodb  # если нет
   $ mongod -f mongod.conf
   ```

2. webpack:

   ```bash
   $ ./node_modules/.bin/webpack --watch
   ```

3. Сервер на Node.js:

   ```bash
   $ node server/
   ```


## Инструменты

### git

> **Примечание:** можно с тем же успехом всё делать через графический клиент, но они все разные я в них не шарю

```bash
$ git status
```

```bash
$ git checkout имя_ветки
```

Список веток:

`$ git branch` (только локальные)

`$ git branch -a` (локальные и *"гитхабовские"*)

Скачать с *"гитхаба"* новые коммиты *(можно вводить и не ссать)*:

```bash
$ git fetch
```

Скачать с *"гитхаба"* новые коммиты **и** начать merge текущей ветки с тамошней ее версией *(короче, лучше так не делать)*:

```bash
$ git pull
```

Загрузить изменения на "гитхаб":

`$ git push origin имя-ветки` (определенную ветку)

`$ git push origin --all` (все локальные ветки сразу)

### Dev-сервер на node.js

> Задача: просто раздать статические файлы

Установка:

```bash
$ npm install -g http-server
```

Запуск в текущей папке:

```bash
$ http-server -c-1
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://192.168.31.134:8080
Hit CTRL-C to stop the server
```

Ключ `-c-1` писать необязательно (он отключает кэширование файлов), но на локальном компе рекомендуется.

## JS

### Книга

#### McFarland — JavaScript: The Missing Manual

Есть два стула:
- первое издание (2008), скачать без SMS: [`ftp://ftp.micronet-rostov.ru/linux-support/books/programming/JavaScript/[O%60Reilly]%20-%20JavaScript.%20The%20Missing%20Manual%20-%20[McFarland].pdf`](ftp://ftp.micronet-rostov.ru/linux-support/books/programming/JavaScript/[O%60Reilly]%20-%20JavaScript.%20The%20Missing%20Manual%20-%20[McFarland].pdf)
- третье издание (2014), скачать без регистрации: [`http://web-algarve.com/books/JS%20AJAX%20jquery%20&%20angular/JavaScript%20&%20jQuery-%20The%20Missing%20Manual,%203rd%20Edition.pdf`](http://web-algarve.com/books/JS%20AJAX%20jquery%20&%20angular/JavaScript%20&%20jQuery-%20The%20Missing%20Manual,%203rd%20Edition.pdf)

С одной стороны, третье намного новее, с другой стороны, там большой упор делается на jQuery.

#### Haverbeke — Eloquent Javascript, 3rd ed.

[Онлайн-версия и ссылки на PDF](http://eloquentjavascript.net/)

### Общее

#### Лямбды

```js
const doX = () => { console.log("x"); }
const f(x) = x => { return x + 1; }
const add(a, b) = (a, b) => { return a + b; }
```

```js
function doX() { console.log("x"); }
function f(x) { return x + 1; }
function add(a, b) { return a + b; }
```

#### Обход массива

```js
const xs = [1, 4, 8, 8];

xs.forEach(x => {
    console.log(x);
});
```

### DOM

Выбор элементов по CSS-селектору:

- `document.querySelectorAll` — возвращает "массив"
- `document.querySelector` — возвращает один элемент или `null`

Изменение:

- Атрибуты (кроме `class`) доступны в виде свойств:

  ```html
  <a href="https://google.com/">Link text</a>
  ```

  ```js
  const a = document.querySelector('a');
  
  console.log(a.href); // "https://google.com/"
  a.href = "pidor.ru";
  ```

- Атрибут `class`:

  ```js
  a.classList.add('hui');
  a.classList.remove('hui');
  a.classList.toggle('hui');
  ```

- Содержимое самого элемента:

  ```js
  console.log(a.href); // "Link text"
  a.textContent = "Huink text";
  a.innerHTML = "<strong>HTML</strong> content";
  ```

- Атрибут `style`:

  ```js
  a.style.backgroundColor = 'pink';
  a.style.marginLeft = '3.5em';
  a.style.display = null; // remove declaration
  ```

- Атрибуты `data-*`:

  ```html
  <div data-khokhly="fashisty" data-vova-putin="molodec"></div>
  <script>
      const div = document.querySelector('div');
      
      console.log(div.dataset.khokhly); // "fashisty"
      console.log(div.dataset.vovaPutin); // "molodec"
  </script>
  ```

Создание:

```js
const span = document.createElement('span'); // <span></span>
```

Копирование:

```js
const divTemp = document.querySelector('div#template')

const divOuter = divTemp.cloneNode(); // without children
const div = divTemp.cloneNode(true); // with children
```

Перемещение по дереву:

```js
container.appendChild(el); // insert `el` to `container` (at the end)
container.insertBefore(el, huel); // insert `el` to `container` (before its existing child `huel`)
el.parent.removeChild(el); // remove `el` from the document
```

### События и их обработка

Назначение обработчика:

```js
// `click` event:
elem.onclick = e => { console.log(e.target + "just got clicked"); }
// `mouseenter` event:
elem.onmouseenter = e => { console.log("mouse entered " + e.target); }
// `mouseleave` event:
elem.onmouseleave = e => { console.log("mouse left " + e.target); }
```

[Event reference](https://developer.mozilla.org/en-US/docs/Web/Events) — другие события.

