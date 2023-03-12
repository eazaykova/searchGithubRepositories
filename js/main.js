import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

button_search.addEventListener("click", async function (event) {
	event.preventDefault();

	if (document.querySelector(".results__bodies")) {
		document.querySelector(".results__bodies").remove();
	}
	if (document.querySelector(".results__err")) {
		document.querySelector(".results__err").remove();
	}
	if (document.querySelector(".search__err")) {
		document.querySelector(".search__err").remove();
	}
	if (document.querySelector(".results__rearch")) {
		document.querySelector(".results__rearch").remove();
	}

	let valueSearch = document.querySelector("#search_repository").value;

	if (valueSearch.length < 3) {
		if (document.querySelector(".search__err")) {
			document.querySelector(".search__err").remove();
		}
		let err = document.createElement('span');
		err.classList.add('search__err');
		err.textContent = 'Запрос должен содержать минимум 3 символа!';

		let search = document.querySelector(".search");
		search.appendChild(err);
		document.querySelector("#search_repository").value = '';
		return;
	}

	let result = document.querySelector(".results");

	if (document.querySelector(".results__rearch")) {
		document.querySelector(".results__rearch").textContent = `Поисковой запрос: ${valueSearch}`;
	} else {
		let span = document.createElement('span');
		span.classList.add('results__rearch');
		span.textContent = `Поисковой запрос: ${valueSearch}`;
		result.appendChild(span);
	}

	const octokit = new Octokit({
		auth: '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'
	});

	const queryString = await octokit.request('GET /search/repositories', {
		q: valueSearch
	});
	try {
		for (let i = 0; i < 10; i++) {
			let nam = queryString.data.items[i].name;
			let html_url = queryString.data.items[i].html_url;
			let author = queryString.data.items[i].owner.login;
			let description = queryString.data.items[i].description;
			let language = queryString.data.items[i].language;
			let topics = queryString.data.items[i].topics;

			createBlock(nam, html_url, author, description, language, topics);

			document.querySelector("#search_repository").value = '';
		}
	} catch (error) {
		let err = document.createElement('span');
		err.classList.add('results__err');
		err.textContent = 'По вашему запросу ничего не нашлось...';
		result.appendChild(err);
		document.querySelector("#search_repository").value = '';
	}

})

function createBlock(name, html_url, author, description, language, topics) {

	let result = document.querySelector(".results");

	if (!document.querySelector(".results__bodies")) {
		let bodies = document.createElement('div');
		bodies.classList.add('results__bodies');
		result.appendChild(bodies);
	}

	let bodies = document.querySelector(".results__bodies");

	let body = document.createElement('div');
	body.classList.add('results__body');
	bodies.appendChild(body);

	let fullName = document.createElement('div');
	fullName.classList.add('results__full-name');
	body.appendChild(fullName);

	let url = document.createElement('a');
	url.classList.add('results__name');
	let text = document.createTextNode(name);
	url.appendChild(text);
	url.href = html_url;
	url.target = '_blank';
	fullName.appendChild(url);

	let authName = document.createElement('span');
	authName.classList.add('results__author');
	authName.textContent = `Автор: ${author}`;
	fullName.appendChild(authName);

	let descrip = document.createElement('div');
	descrip.classList.add('results__description');
	descrip.textContent = description;
	body.appendChild(descrip);

	let extra = document.createElement('div');
	extra.classList.add('results__extra');
	body.appendChild(extra);

	if (language) {
		let lang = document.createElement('div');
		lang.classList.add('results__language', 'language');
		extra.appendChild(lang);

		let langTitle = document.createElement('span');
		langTitle.classList.add('language__title');
		langTitle.textContent = 'Язык';
		lang.appendChild(langTitle);

		let langLang = document.createElement('span');
		langLang.classList.add('language__language');
		langLang.textContent = language;
		lang.appendChild(langLang);
	}

	console.log(topics);

	if (topics?.length) {
		if (topics.length > 5) {
			topics = topics.slice(0, 5);
			topics = `${topics.join(' ')}…`;
		} else {
			topics = topics.join(' ');
		}

		let topic = document.createElement('div');
		topic.classList.add('results__topics', 'topics');
		extra.appendChild(topic);

		let topicTitle = document.createElement('span');
		topicTitle.classList.add('topics__title');
		topicTitle.textContent = 'Темы';
		topic.appendChild(topicTitle);

		let topicTopic = document.createElement('span');
		topicTopic.classList.add('topics__topics');
		topicTopic.textContent = topics;
		topic.appendChild(topicTopic);
	}

}
