const app = document.getElementById('app')
const container = document.querySelector('.container')
const wrapper = document.querySelector('.wrapper')
const search = document.querySelector('.search')
const searchInput = document.querySelector('.search__input')
const searchItems = document.querySelector('.search__items')
const posts = document.querySelector('.posts')
const postsItems = document.querySelector('.posts__items')
const searchItem = document.querySelector('.search__item')

const searchAuto = (rep) => {
	const searchLi = document.createElement('li')
	const a = document.createElement('a')
	searchLi.classList.add('search__item')
	a.classList.add('search__link')
	searchLi.appendChild(a)

	if (rep.name.length > 36) {
		a.textContent = rep.name.slice(0, 36) + '...'
	} else {
		a.textContent = rep.name
	}

	searchItems.appendChild(searchLi)

	searchLi.addEventListener('click', (e) => {
		const postsLi = document.createElement('li')
		const postsItemText = document.createElement('span')
		const postsItemDelete = document.createElement('span')
		postsLi.classList.add('posts__item')
		postsItemText.classList.add('posts__item-text')
		postsItemDelete.classList.add('posts__item-delete')
		postsLi.appendChild(postsItemText)
		postsLi.appendChild(postsItemDelete)
		postsItemText.insertAdjacentHTML("afterbegin", `<span>Name: ${rep.name.length > 20 ? rep.name.slice(0, 20) + '...' : rep.name}</span>
								<span>Owner: ${rep.owner.login.length > 20 ? rep.owner.login.slice(0, 20) + '...' : rep.owner.login}</span>
								<span>Stars: ${rep.stargazers_count}</span>`)
		postsItems.appendChild(postsLi)
		searchInput.value = ''
		searchItems.textContent = ''
	})
}

const searchRep = async () => {
	return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`)
		.then(res => {
			if (res.ok) {
				return res.json()
			}
		})
		.then(rep => {
			rep.items.forEach(r => {
				searchAuto(r)
			})
		})
}

const searchDeb = (fn) => {
	let timer

	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			searchItems.textContent = ''
			fn.apply(this, args)
		}, 1000)
	}
}

const searchDebFn = searchDeb(searchRep)

searchInput.addEventListener('keyup', (e) => {
	if (e.keyCode !== 32 && searchInput.value.length !== 0 && e.keyCode !== 8) {
		searchDebFn()
	}

	if (searchInput.value.length === 0) {
		searchItems.textContent = ''
	}

})


postsItems.addEventListener('click', e => {
	if (e.target.className === 'posts__item-delete') {
		e.target.parentElement.remove()
	}

})