
const cities = [
	{
		"id": "los-angeles",
		"name": "Лос-Анджелес",
		"map": {
			"center": [34.0619261, -118.2961232],
			"zoom": 11
		},
		"districts": [
			{ "id": "compton", "name": "Комптон" },
			{ "id": "willowbrook", "name": "Виллоубрук" },
			{ "id": "south-central", "name": "Южный Централ" },
			{ "id": "beverly-hills", "name": "Беверли Хиллз" }
		]
	},
	{
		"id": "moscow",
		"name": "Москва",
		"map": {
			"center": [55.751574, 37.573856],
			"zoom": 10
		},
		"districts": [
			{ "id": "novoslobodskaya", "name": "Новослободская" },
			{ "id": "aeroport", "name": "Аэропорт" },
			{ "id": "lefortovo", "name": "Лефортово" },
			{ "id": "bibirevo", "name": "Бибирево" }
		]
	},
	{
		"id": "ivanovo",
		"name": "Иваново",
		"map": {
			"center": [56.999780, 40.978469],
			"zoom": 13
		},
		"districts": [
			{ "id": "sovetsky", "name": "Советсий" },
			{ "id": "leninsky", "name": "Ленинский" },
			{ "id": "oktyabrsky", "name": "Октябрьский" },
			{ "id": "frunzensky", "name": "Фрунзенский" },
		]
	}
];

const cityById = id => {
	for(const city of cities) {
		if(city.id === id) {
			return city;
		}
	}

	return null;
};

export default cities;
export { cityById };
