let animes = [];

onload = () => {
    let tabs = document.querySelectorAll('.navBar .tab');

    const mostra = (elem) => {
        if (elem) {
            for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
            elem.classList.add('active');
        }

        for (let i = 0; i < tabs.length; i++) {
            let comp = tabs[i].getAttribute('for');
            if (tabs[i].classList.contains('active'))
                document.querySelector('#' + comp).classList.remove('hidden');
            else document.querySelector('#' + comp).classList.add('hidden');
        }
    };

    for (let i = 0; i < tabs.length; i++)
        tabs[i].onclick = (e) => {
            mostra(e.target);
        };

    mostra();
};

onload = () => {
    getAnimesFromLocalStorage();
    showAnimeList();
    uncheckStars();
    document.querySelector('#inputNewAnime').oninput = monitoraCampoAdic;
    document.querySelector('#inputUpdateRating').oninput = monitoraCampoAlt;

    document.querySelector('#btnAdic').onclick = () => {
        document.querySelector('#btnInc').disabled = true;
        activateScreen('registration-screen');
        uncheckStars();
        document.querySelector('#inputNewAnime').focus();
    };

    document.querySelector('#btnSort').onclick = () => {
        if (animes.length) animes.sort((a, b) => a.rating - b.rating).reverse()
        showAnimeList();
        activateScreen('home-screen');
    };

    document.querySelector('#btnFilter').onclick = () => {
        hideHeaderButtons();
    };

    document.querySelector('#btnSearch').onclick = () => {
        getAnimesFromLocalStorage();
        const search = document.querySelector('#inputSearch').value;

        if (search) {
            animes = animes.filter(anime => anime.description.toUpperCase().match(search.toUpperCase()))
            showAnimeList();
        } else {
            showAnimeList();
            getAnimesFromLocalStorage();
            showHeaderButtons();
        }
    };

    // document.querySelector('#blank').onclick = () => {
    //     getAnimesFromLocalStorage();
    //     showAnimeList();
    //     showHeaderButtons();
    // };

    document.querySelector('#btnCanc1').onclick = () => {
        document.querySelector('#inputNewAnime').value = '';
        activateScreen('home-screen');
    };

    document.querySelector('#btnCanc2').onclick = () => {
        let campo = document.querySelector('#inputUpdateRating');
        campo.value = '';
        campo.removeAttribute('data-id');
        activateScreen('home-screen');
    };

};



const showAnimeList = () => {
    const animeRankigList = document.querySelector('#animeRankigList');
    const animeRankigList2 = document.querySelector('#animeRankigList2');
    const animeRankigListTitle = document.querySelector('#animeRankigListTitle');
    const animeRankigList2Title = document.querySelector('#animeRankigList2Title');
    animeRankigList.innerHTML = '';
    animeRankigList2.innerHTML = '';
    animes.forEach((anime) => {
        let elemAnimeTitle = document.createElement('li');
        elemAnimeTitle.innerHTML = `${anime.description}`;
        elemAnimeTitle.setAttribute('data-id', anime.id);
        elemAnimeTitle.onclick = () => {
            let field = document.querySelector('#inputUpdateRating');
            activateScreen('update-screen');
            field.value = anime.description;
            checkStars(anime.rating + 5);
            field.setAttribute('data-id', anime.id);
            field.focus();
        };
        animeRankigList.appendChild(elemAnimeTitle);
        let elemRating = document.createElement('li');
        elemRating.innerHTML = `${anime.rating}`;
        animeRankigList2.appendChild(elemRating)
    });
    document.querySelector('#estado').innerText = animes.length;
    if (animes.length > 0) {
        animeRankigList.classList.remove('hidden');
        animeRankigList2.classList.remove('hidden');
        animeRankigListTitle.classList.remove('hidden');
        animeRankigList2Title.classList.remove('hidden');
        document.querySelector('#blank').classList.add('hidden');
    } else {
        animeRankigList.classList.add('hidden');
        animeRankigList2.classList.add('hidden');
        animeRankigListTitle.classList.add('hidden');
        animeRankigList2Title.classList.add('hidden');
        document.querySelector('#blank').classList.remove('hidden');
    }
};

const activateScreen = (comp) => {
    let listaDeTelas = document.querySelectorAll('body > .component');
    listaDeTelas.forEach((c) => c.classList.add('hidden'));
    document.querySelector('#' + comp).classList.remove('hidden');
};

const addAnime = () => {
    let field = document.querySelector('#inputNewAnime');
    let description = field.value;
    if (description != '') {
        animes.push({
            id: Math.random().toString().replace('0.', ''),
            description,
            rating: getRating()
        });
        field.value = '';
        activateScreen('home-screen');
        uncheckStars();
        saveAnimeRatings();
        showAnimeList();
    }
};

const monitoraCampoAdic = (e) => {
    let button = document.querySelector('#btnInc');
    if (e.target.value.length > 0) button.disabled = false;
    else button.disabled = true;
};

const updateAnimeRating = () => {
    let field = document.querySelector('#inputUpdateRating');
    let idRating = field.getAttribute('data-id');
    let i = animes.findIndex((t) => t.id == idRating);
    animes[i].description = field.value;
    animes[i].rating = getRating() - 5;
    field.value = '';
    field.removeAttribute('data-id');
    activateScreen('home-screen');
    saveAnimeRatings();
    showAnimeList();
};

const removeAnimeRating = () => {
    let field = document.querySelector('#inputUpdateRating');
    let idRating = field.getAttribute('data-id');
    animes = animes.filter((t) => t.id != idRating);
    field.value = '';
    field.removeAttribute('data-id');
    activateScreen('home-screen');
    saveAnimeRatings();
    showAnimeList();
};

const monitoraCampoAlt = (e) => {
    let botao = document.querySelector('#btnAlt');
    if (e.target.value.length > 0) botao.disabled = false;
    else botao.disabled = true;
};

const saveAnimeRatings = () => {
    localStorage.setItem('animeRatings', JSON.stringify(animes));
};

const checkStars = (starNumber) => {
    uncheckStars();
    const stars = document.getElementsByClassName("fa fa-star");

    for (let i = 0; i < starNumber; i++) {
        const className = stars[i].className
        stars[i].className = `${className} checked`
    }
}

const uncheckStars = () => {
    const stars = document.getElementsByClassName("fa fa-star");

    for (let i = 0; i < stars.length; i++) {
        stars[i].className = `fa fa-star`
    }

}

const getRating = () => {
    const checkedStars = document.getElementsByClassName("fa fa-star checked");
    return checkedStars.length
}

const getAnimesFromLocalStorage = () => {
    const storedAnimes = JSON.parse(localStorage.getItem('animeRatings'));
    if (storedAnimes) animes = storedAnimes;
}

const hideHeaderButtons = () => {
    const componentTitle = document.querySelector('.componentTitle');
    const adcBtnComponent = document.querySelector('.adcBtnComponent');
    const sortBtnComponent = document.querySelector('.sortBtnComponent');
    const searchComponent = document.querySelector('.searchComponent');
    const filterBtnComponent = document.querySelector('.filterBtnComponent');
    const searchBtnComponent = document.querySelector('.searchBtnComponent');
    componentTitle.classList.add("hidden")
    adcBtnComponent.classList.add("hidden")
    sortBtnComponent.classList.add("hidden")
    filterBtnComponent.classList.add("hidden")
    searchComponent.classList.remove("hidden")
    searchBtnComponent.classList.remove("hidden")
}

const showHeaderButtons = () => {
    const componentTitle = document.querySelector('.componentTitle');
    const adcBtnComponent = document.querySelector('.adcBtnComponent');
    const sortBtnComponent = document.querySelector('.sortBtnComponent');
    const searchComponent = document.querySelector('.searchComponent');
    const filterBtnComponent = document.querySelector('.filterBtnComponent');
    const searchBtnComponent = document.querySelector('.searchBtnComponent');
    componentTitle.classList.remove("hidden")
    adcBtnComponent.classList.remove("hidden")
    sortBtnComponent.classList.remove("hidden")
    filterBtnComponent.classList.remove("hidden")
    searchComponent.classList.add("hidden")
    searchBtnComponent.classList.add("hidden")
}