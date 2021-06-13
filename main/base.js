const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cateElement = $('.list-options');
const subELement = $('.sub-menu');
const listELement = $('.list-sub');
const topVideoElment = $(".list-top-film");


const web = {
    dataHeader: "http://localhost:3000/category",
    dataMovies: "http://localhost:3000/video",
    isMouseDown: false,

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
                var output = data.map(item => {
                    return `
                    <div class="carousel-item">
                        <a href="#" class="link-movie">
                            <div class="poster-carousel"
                                style="background-image: url(${item.poster})">
                            </div>
                            <div class="info-carousel">
                                <h1>${item.name}</h1>
                                <h4>${item.title}</h4>
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
                let x = 1;
                let startX = boxCarousel.clientWidth;
                var c;
                var lastItem = carouselItem[carouselItem.length - 1]
                var marginItem =
                    parseInt(getComputedStyle(lastItem).marginLeft.slice(0, 2))

                nextC.onclick = () => {
                    if ((lastItem.offsetLeft - lastItem.clientWidth)
                        < carouselWrapper.clientWidth) {
                        c = (carouselItem.length * lastItem.clientWidth
                            + (carouselItem.length * marginItem) + marginItem)
                            - carouselWrapper.clientWidth
                    } else {
                        c = startX * x;
                    }
                    for (item of carouselItem) {
                        item.style.right = c + 'px'
                    }
                    x++
                }

                prevC.onclick = () => {

                    if ((boxCarousel.scrollWidth - carouselWrapper.clientWidth)
                        < lastItem.offsetLeft) {
                        c = 0
                    } else {
                        c = c - startX
                    }
                    for (item of carouselItem) {
                        item.style.right = c + 'px'
                    }
                    if (x > 1) {
                        x--
                    } else {
                        x = 1
                    }
                }
                return data
            })
            .then(data => {
                var topVideo = data.filter(item => item.views > 100000)
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
                                        <span class="title-top-film">${item.title}</span>
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
            })
            .catch(() => console.error("Not found api"))
    },

    start() {
        this.handleHeaders();
        this.handleCarousel();
    }
}

web.start()
