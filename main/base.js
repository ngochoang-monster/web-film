const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cateElement = $('.list-options');
const subELement = $('.sub-menu');
const listELement = $('.list-sub');
const topVideoElment = $(".list-top-film");
const titleCarousel = $('.title-box-carousel-wrapper');
const boxListFilm = $$('.box-list-film');
const titleName = $$('.title-name');
const listFilm = $$('.list-film')

const web = {
    dataHeader: "http://localhost:3000/category",
    dataMovies: "http://localhost:3000/video",
    isMouseDown: false,
    isNext: true,

    handleHeaders() {
        fetch(this.dataHeader)
            .then(response => response.json())
            .then((data) => {
                var output = data.map(item => `
            <li class="option-item">
            <a href="#" class="item-link">${item.title}</a>
            </li>
            `)
                cateElement.innerHTML = output.join("\n")
                return data
            })
            .then(data => {
                const itemElement = $$(".item-link");
                itemElement.forEach(item => {
                    const parentItem = item.closest(".option-item");
                    const leftParent = parentItem.offsetLeft;
                    parentItem.onmouseover = () => {
                        data.forEach(data => {
                            if (item.textContent == data.title) {
                                if (data.sub_item) {
                                    var output = data.sub_item.map((item) => `
                                        <li class="sub-item">
                                            <a href="${item.link}" class="sub-link-menu">${item.title}</a>
                                        </li>
                                    `)
                                    subELement.style.display = "block"
                                    listELement.innerHTML = output.join("\n")
                                } else {
                                    subELement.style.display = "none"
                                }
                                parentItem.onmouseleave = () =>
                                    subELement.style.display = "none"
                                subELement.style.left = leftParent + "px";
                                // subELement.style.transition = "all 0.3s"

                            }
                        })
                    };


                })
                subELement.onmouseover = () =>
                    subELement.style.display = "block"
                subELement.onmouseleave = () =>
                    subELement.style.display = "none"

            })
            .catch(() => console.error("Not found api"))
    },

    handleCarousel() {
        const boxCarousel = $('.box-carousel');
        fetch(this.dataMovies)
            .then(response => response.json())
            .then(data => {
                const title = titleCarousel.textContent.toLowerCase()
                var results = data.filter(item => {
                    return item.title.includes(title)
                })
                var output = results.map(item => {
                    return `
                    <div class="carousel-item">
                        <a href="#" class="link-movie">
                            <div class="poster-carousel"
                                style="background-image: url(${item.poster})">
                            </div>
                            <div class="info-carousel">
                                <h1>${item.name}</h1>
                                <h4>${item.sub_name}</h4>
                            </div>
                            <div class="title">
                                <span>${item.status}</span>
                            </div>
                        </a>
                    </div>
                `
                })

                boxCarousel.innerHTML = output.join('\n')

                const carouselWrapper = $(".carousel-wrapper");
                const carouselItem = $$(".carousel-item");
                const nextC = $('.next-carousel');
                const prevC = $('.previous-carousel');
                var x = 0;
                var lastItem = carouselItem[carouselItem.length - 1]
                var c;
                var marginItem =
                    parseInt(getComputedStyle(lastItem).marginLeft.slice(0, 2));
                let startX = lastItem.clientWidth * 3 + marginItem * 3;

                nextC.onclick = () => {
                    if (this.isNext) {
                        x++
                    } else {
                        x = x
                    }
                    if ((lastItem.offsetLeft - lastItem.clientWidth - marginItem)
                        < carouselWrapper.clientWidth) {
                        c = (carouselItem.length * lastItem.clientWidth
                            + (carouselItem.length * marginItem) + marginItem)
                            - carouselWrapper.clientWidth
                        this.isNext = false;
                    } else {
                        c = startX * x;
                    }
                    for (item of carouselItem) {
                        item.style.right = c + 'px'
                    }

                }

                prevC.onclick = () => {
                    this.isNext = true;
                    if (x > 1) {
                        x--
                    } else {
                        x = 0
                    }
                    if ((boxCarousel.scrollWidth - carouselWrapper.clientWidth)
                        < lastItem.offsetLeft) {
                        c = 0
                    } else {
                        c = c - startX
                    }
                    for (item of carouselItem) {
                        item.style.right = c + 'px'
                    }
                }
                return data
            })
            .then(data => {
                var topVideo = data.filter(item => item.views)
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 10)
                var output = topVideo.map(item => {
                    return `
                        <li class="item-top-film">
                            <a href="#" class="link-top-film">
                                <div class="wrapper-top-film">
                                    <div class="img-backgr" style="background-image: url(${item.poster})"></div>
                                    <div class="content-top-film">
                                        <h4 class="name-top-film">${item.name}</h4>
                                        <span class="title-top-film">${item.sub_name}</span>
                                    </div>
                                    <div class="views-top-film">
                                        <div class="number-views">${item.views.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}</div>
                                        <span class="eye-icon"><i class="far fa-eye"></i></span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    `
                })

                topVideoElment.innerHTML = output.join('\n')
                return data;
            })
            .then(data => {
                var obj = {
                    a: []
                };
                titleName.forEach((titleName, index) => {
                    var results = data.filter(item => item.title.includes(titleName.textContent.toLowerCase()))

                    var output = results.map(item => {
                        return `
                        <li class="item-film">
                            <a href="#" class="link-item-film">
                                <div class="main-box">
                                    <div class="poster-film" style="background-image: url(${item.poster})">
                                        <div class="info-film">
                                            <div class="info">
                                                <h1>${item.name}</h1>
                                                <h4>${item.sub_name}</h4>
                                            </div>
                                            <div class="time-video-film">
                                                <span>${item.time} phút</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="title-film">
                                        <span>${item.status}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    `
                    })
                    obj.a.push(output)
                })

                listFilm.forEach((item, index) => {
                    item.innerHTML = obj.a[index].join("")
                })
            })
            .catch(() => console.error("Not found api"))
    },

    renderListVideo() {

    },

    start() {
        this.handleHeaders();
        this.handleCarousel();
    }
}

web.start()
