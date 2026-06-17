/*
	Versao orientada por JSON.

	Este arquivo mostra uma separacao comum em projetos reais:
	- dados editaveis ficam no JSON;
	- estrutura fica no HTML;
	- montagem dinamica fica no JavaScript.
*/

const DATA_URL = "assets/data/carreira.json";

const createElement = (tagName, className, textContent) => {
	const element = document.createElement(tagName);

	if (className) {
		element.className = className;
	}

	if (textContent) {
		element.textContent = textContent;
	}

	return element;
};

// Icones de contato (Bootstrap Icons, embutidos como SVG).
// Cada chave representa um tipo de contato reconhecido pela URL.
const CONTACT_ICONS = {
	email:
		'<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',
	linkedin:
		'<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>',
	github:
		'<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>',
	link:
		'<svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/><path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>',
};

// Decide qual icone usar a partir da URL do contato (e-mail, LinkedIn, GitHub ou generico).
const getContactIconMarkup = (url) => {
	const normalizedUrl = url.toLowerCase();

	if (normalizedUrl.startsWith("mailto:")) {
		return CONTACT_ICONS.email;
	}

	if (normalizedUrl.includes("linkedin.com")) {
		return CONTACT_ICONS.linkedin;
	}

	if (normalizedUrl.includes("github.com")) {
		return CONTACT_ICONS.github;
	}

	return CONTACT_ICONS.link;
};

const createBadgeList = (items, ariaLabel) => {
	const list = createElement("ul", "list-inline");
	list.setAttribute("aria-label", ariaLabel);

	items.forEach((item) => {
		const listItem = createElement("li", "list-inline-item");
		const badge = createElement("span", "badge bg-secondary badge-pill", item);

		listItem.appendChild(badge);
		list.appendChild(listItem);
	});

	return list;
};

const renderHeadMetadata = ({ seo, profile }) => {
	document.title = seo.title;
	document.querySelector('meta[name="description"]').setAttribute("content", seo.description);

	const author = document.createElement("meta");
	author.name = "author";
	author.content = seo.author;
	document.head.appendChild(author);

	const canonical = document.createElement("link");
	canonical.rel = "canonical";
	canonical.href = seo.canonicalUrl;
	document.head.appendChild(canonical);

	const openGraphTitle = document.createElement("meta");
	openGraphTitle.setAttribute("property", "og:title");
	openGraphTitle.content = seo.title;
	document.head.appendChild(openGraphTitle);

	const openGraphDescription = document.createElement("meta");
	openGraphDescription.setAttribute("property", "og:description");
	openGraphDescription.content = seo.description;
	document.head.appendChild(openGraphDescription);

	const openGraphImage = document.createElement("meta");
	openGraphImage.setAttribute("property", "og:image");
	openGraphImage.content = profile.photo;
	document.head.appendChild(openGraphImage);
};

const renderProfile = ({ profile, contacts }) => {
	document.getElementById("profile-name").textContent = profile.name;
	document.getElementById("profile-headline").textContent = profile.headline;
	document.getElementById("profile-summary").textContent = profile.summary;

	const photo = document.getElementById("profile-photo");
	photo.src = profile.photo;
	photo.alt = profile.photoAlt;

	const cvLink = document.getElementById("cv-link");
	cvLink.href = profile.cvUrl;
	cvLink.setAttribute("aria-label", `Baixar curriculo de ${profile.name} em PDF`);

	const contactList = document.getElementById("contact-list");
	contactList.innerHTML = "";

	contacts.forEach((contact) => {
		const listItem = createElement("li", "mb-2");
		const link = createElement("a", "text-link");
		link.href = contact.url;
		link.innerHTML = `${getContactIconMarkup(contact.url)} ${contact.label}`;

		if (contact.url.startsWith("http")) {
			link.target = "_blank";
			link.rel = "noopener";
		}

		listItem.appendChild(link);
		contactList.appendChild(listItem);
	});
};

const renderCareerTimeline = (careerSteps) => {
	const timeline = document.getElementById("career-timeline");
	timeline.innerHTML = "";

	careerSteps.forEach((step, index) => {
		const article = createElement("article", "resume-timeline-item position-relative pb-5");
		const titleId = `career-step-${index + 1}`;
		article.setAttribute("aria-labelledby", titleId);

		const header = createElement("div", "resume-timeline-item-header mb-2");
		const title = createElement("h3", "resume-position-title font-weight-bold mb-1", step.title);
		title.id = titleId;
		header.appendChild(title);

		const description = createElement("div", "resume-timeline-item-desc");
		description.appendChild(createElement("p", "", step.description));

		description.appendChild(createElement("h4", "resume-timeline-item-desc-heading font-weight-bold", "Soft skills exigidas para essa etapa"));

		const softSkillList = createElement("ul");
		step.softSkills.forEach((skill) => {
			softSkillList.appendChild(createElement("li", "", skill));
		});
		description.appendChild(softSkillList);

		description.appendChild(createElement("h4", "resume-timeline-item-desc-heading font-weight-bold", "Roadmap de aprendizado"));
		description.appendChild(createBadgeList(step.roadmap, `Tecnologias da etapa ${step.title}`));

		article.appendChild(header);
		article.appendChild(description);
		timeline.appendChild(article);
	});
};

const renderSkills = ({ skillGroups, otherSkills }) => {
	const skillGroupsContainer = document.getElementById("skill-groups");
	skillGroupsContainer.innerHTML = "";

	skillGroups.forEach((group) => {
		const groupElement = createElement("div", "resume-skill-item");
		groupElement.appendChild(createElement("h3", "resume-skills-cat font-weight-bold h5", group.title));

		const list = createElement("ul", "list-unstyled mb-4");

		group.skills.forEach((skill) => {
			const item = createElement("li", "mb-2");
			item.appendChild(createElement("div", "resume-skill-name", skill.name));

			const progress = createElement("div", "progress resume-progress");
			progress.setAttribute("aria-label", `${skill.name}: ${skill.level}%`);

			const bar = createElement("div", "progress-bar theme-progress-bar-dark");
			bar.setAttribute("role", "progressbar");
			bar.setAttribute("aria-valuemin", "0");
			bar.setAttribute("aria-valuemax", "100");
			bar.setAttribute("aria-valuenow", String(skill.level));
			bar.style.width = `${skill.level}%`;

			progress.appendChild(bar);
			item.appendChild(progress);
			list.appendChild(item);
		});

		groupElement.appendChild(list);
		skillGroupsContainer.appendChild(groupElement);
	});

	const otherSkillsList = document.getElementById("other-skills");
	otherSkillsList.innerHTML = "";

	otherSkills.forEach((skill) => {
		const item = createElement("li", "list-inline-item");
		item.appendChild(createElement("span", "badge badge-light", skill));
		otherSkillsList.appendChild(item);
	});
};

const renderLanguages = (languages) => {
	const languageList = document.getElementById("language-list");
	languageList.innerHTML = "";

	languages.forEach((language) => {
		const item = createElement("li", "mb-2");
		item.appendChild(createElement("strong", "", language.name));
		item.append(" ");
		item.appendChild(createElement("span", "text-muted", `(${language.level})`));
		languageList.appendChild(item);
	});
};

const renderPage = (data) => {
	renderHeadMetadata(data);
	renderProfile(data);
	renderCareerTimeline(data.careerSteps);
	renderSkills(data);
	renderLanguages(data.languages);
};

const parseCareerData = (jsonText) => {
	try {
		return JSON.parse(jsonText);
	} catch (originalError) {
		// Fallback: tolerate trailing commas in arrays/objects from manual edits.
		const sanitized = jsonText.replace(/,\s*([}\]])/g, "$1");

		try {
			console.warn("JSON com virgula sobrando detectado. Aplicando correção automatica.");
			return JSON.parse(sanitized);
		} catch {
			throw originalError;
		}
	}
};

fetch(DATA_URL)
	.then((response) => {
		if (!response.ok) {
			throw new Error("Nao foi possivel carregar o JSON.");
		}

		return response.text();
	})
	.then(parseCareerData)
	.then(renderPage)
	.catch((error) => {
		const main = document.getElementById("conteudo-principal");
		const warning = createElement("p", "alert alert-warning m-5", "Nao foi possivel carregar os dados do JSON. Execute a pagina em um servidor local ou publique no GitHub Pages.");
		main.prepend(warning);
		console.error(error);
	});
