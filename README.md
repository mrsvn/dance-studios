
### Инструменты

#### git

`git status`

`git checkout <имя_ветки>`

Список веток: `git branch`, `git branch -a`

Загрузка изменений *(можно вводить и не ссать)*:

`git fetch`

Загрузка изменений и merge текущей ветки с тамошней *(лучше так не делать)*:

`git pull`

#### Dev-сервер на node.js

Установка:

```bash
$ npm install -g http-server
```

Запуск в текущей папке:

```bash
$ http-server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://192.168.31.134:8080
Hit CTRL-C to stop the server
```

### JS

Книга: *McFarland — JavaScript: The Missing Manual* ([скачать без смс на сайте МИЭМ](http://nadin.miem.edu.ru/images_2015/css-the-missing-manual.pdf))

#### Общее

##### Лямбды

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

##### Обход массива

```js
const xs = [1, 4, 8, 8];

xs.forEach(x => {
    console.log(x);
});
```

#### DOM

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

#### События и их обработка

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

