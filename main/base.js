const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cateElement = $('.list-options');
const subELement = $('.sub-menu');
const listELement = $('.list-sub');


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
        fetch(this.dataMovies)
            .then(response => response.json())
            .then(data => renderMovies(data))
            .catch(() => console.error("Not found api"))

        renderMovies = (data) => {
            const boxCarousel = $('.box-carousel');
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

            const carouselItem = $$(".carousel-item");
            const nextC = $('.next-carousel');
            const prevC = $('.previous-carousel');
            var a = 0;

            nextC.onclick = () => {
                for (item of carouselItem) {
                    a = item.offsetWidth
                    item.style.right = a + "px"
                }
            }

            prevC.onclick = () => {
                carouselItem.forEach((item, i) => {
                    // item.style.right = item.offsetWidth + "px"
                    console.log([item])
                })
            }
        }
    },

    start() {
        this.handleHeaders();
        this.handleCarousel();
    }
}

web.start()
