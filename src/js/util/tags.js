
const tags = [
    { "id": "jazz", "name": "Джаз" },
    { "id": "modern", "name": "Модерн" },
    { "id": "jazz-modern", "name": "Джаз-модерн" },
    { "id": "bachata", "name": "Бачата" },
    { "id": "africa-bambaataa", "name": "Африка бамбата" },
    { "id": "taliban", "name": "Талибан" },
    { "id": "secretariat", "name": "Секретариат" },
    { "id": "striptease", "name": "Стриптиз" },
    { "id": "pole-balley", "name": "Балет на шесте" },
    { "id": "bottle-waltz", "name": "Вальс на бутылке" },
    { "id": "wedding", "name": "Свадебный танец" },
    { "id": "heron", "name": "Как цапля" }
];

const tagNameById = id => {
    for (const tag of tags) {
        if (tag.id === id) {
            return tag.name;
        }
    }

    return null;
};

export { tags, tagNameById };
