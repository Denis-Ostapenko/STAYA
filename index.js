
const tabItemSelector = '.about__tabs-item';
const contentItemSelector = '.about__content';

class TabsManager {
    constructor(navNode) {
        this.tabs = [];
        this.activeTab = null;
        this.initFromHtml(navNode);
        this.activateTab(this.tabs[0]);
    }

    initFromHtml(navNode) {
        const headers = navNode.querySelectorAll(tabItemSelector);
        const contents = navNode.querySelectorAll(contentItemSelector);
        for (var i = 0; i < headers.length; i++) {
            this.registerTab(headers[i], contents[i]);
        }
    }

    registerTab(header, content) {
        const tab = new TabItem(header, content);
        tab.onActivate(() => this.activateTab(tab));
        this.tabs.push(tab);
    }

    activateTab(tabItem) {
        if (this.activeTab) {
            this.activeTab.setActive(false);
        }

        this.activeTab = tabItem;
        this.activeTab.setActive(true);
    }

}

const activeTabHeaderClass = 'about__tabs-item--active';
const activeTabContentClass = 'about__content--active';

class TabItem {
    constructor(header, content) {
        this.header = header;
        this.content = content;
    }
    onActivate(action) {
        this.header.addEventListener('click', () => action(this));
    }
    setActive(value) {
        this.header.classList.toggle(activeTabHeaderClass, value);
        this.content.classList.toggle(activeTabContentClass, value);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TabsManager(document.querySelector('.about'));
})

const animationNextName = "сarouselRight";
const animationPrevName = "сarouselLeft";

class СarouselManager {
    constructor(navNode, controlSelector, сarouselItemSelector, scrollingItems = 3, firstActiveElement = 1) {
        this.сarouselArr = [];
        this.сarouselActivItems = [];
        this.control_prev = null;
        this.control_next = null;
        this.scrollingItems = scrollingItems;
        this.controlSelector = controlSelector;
        this.сarouselItemSelector = сarouselItemSelector;
        this.firstActiveElement = firstActiveElement;
        this.initFromHtml(navNode);
    }

    initFromHtml(navNode) {
        const сarouselItems = navNode.querySelectorAll(`.${this.сarouselItemSelector}`);
        const control_prev = navNode.querySelector(`.${this.controlSelector}.prev`);
        const control_next = navNode.querySelector(`.${this.controlSelector}.next`);
        for (var i = 0; i < сarouselItems.length; i++) {
            this.registerCarouselItem(сarouselItems[i], i);
        }
        this.сarouselActivItems = [this.firstActiveElement - 1, this.firstActiveElement - 1 + this.scrollingItems - 1];
        this.сarouselArr.forEach((element, index) => {
            if (index >= this.сarouselActivItems[0] && index <= this.сarouselActivItems[1]) {
                // if (element.carouselItem.className.indexOf(ActiveCarouselItem) === -1) {
                //     element.setActive(true)
                // }
                element.setActive(true)
            } else {
                element.setActive(false)
            }

        })
        this.onActivate(control_prev)
        this.onActivate(control_next)
    }
    registerCarouselItem(сarouselItem, i) {
        const item = new CarouselItem(сarouselItem, this.сarouselItemSelector + ActiveCarouselItem);
        this.сarouselArr.push(item);
    }
    onActivate(control) {
        const controls = new ControlItem(control, 'deactivate')
        if (control.className.indexOf('prev') !== -1) {
            this.control_prev = controls;
            controls.onActive(() => this.onPrev(controls));
        }
        if (control.className.indexOf('next') !== -1) {
            this.control_next = controls;
            controls.onActive(() => this.onNext());
        }
    }

    onPrev() {
        if (this.сarouselActivItems[0] !== 0) {
            const newArrActive = this.сarouselArr.slice(this.сarouselActivItems[0] - this.scrollingItems, this.сarouselActivItems[0])
            this.сarouselArr.forEach(element => element.setActive(false))
            this.сarouselActivItems = [this.сarouselActivItems[0] - this.scrollingItems, this.сarouselActivItems[0] - 1];
            newArrActive.forEach((element) => {
                element.setActive(true);
                element.carouselItem.style.animationName = animationPrevName;
            })
        }
        if (this.сarouselActivItems[0] === 0) {
            this.control_prev.setActive(true)
            this.control_next.setActive(false)
        } else {
            this.control_prev.setActive(false)
            this.control_next.setActive(false)
        }
    }
    onNext() {
        if (this.сarouselActivItems[1] !== this.сarouselArr.length - 1) {
            const newArrActive = this.сarouselArr.slice(this.сarouselActivItems[1] + 1,
                this.сarouselActivItems[1] + 1 + this.scrollingItems);
            this.сarouselArr.forEach(element => element.setActive(false))
            this.сarouselActivItems = [this.сarouselActivItems[1] + 1, this.сarouselActivItems[1] + this.scrollingItems];
            newArrActive.forEach((element) => {
                element.setActive(true)
                element.carouselItem.style.animationName = animationNextName;
            })
        }
        if (this.сarouselActivItems[1] === this.сarouselArr.length - 1) {
            this.control_next.setActive(true)
            this.control_prev.setActive(false)
        } else {
            this.control_next.setActive(false)
            this.control_prev.setActive(false)
        }
    }
}

const ActiveCarouselItem = '--active';

class ControlItem {
    constructor(controlItem, classDeactivate) {
        this.controlItem = controlItem;
        this.classDeactivate = classDeactivate;
    }
    onActive(action) {
        this.controlItem.addEventListener('click', (event) => {
            event.preventDefault()
            action(this)
        });
    }
    setActive(value) {
        this.controlItem.classList.toggle(this.classDeactivate, value);
    }
}

class CarouselItem {
    constructor(carouselItem, classActive) {
        this.carouselItem = carouselItem;
        this.classActive = classActive;
    }
    setActive(value) {
        this.carouselItem.classList.toggle(this.classActive, value);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new СarouselManager(document.querySelector('.catalog'), 'leashes__control', 'leashes__item', 3, 1);
    new СarouselManager(document.querySelector('.catalog'), 'trackers__control', 'trackers__item', 3, 4);
    new СarouselManager(document.querySelector('.faq'), 'faq__control', 'faq__item', 4, 1);
    new СarouselManager(document.querySelector('.rewiews'), 'rewiews__control', 'rewiews__item', 1, 1);
})

const acc = document.querySelector(".faq").querySelector(".faq__list");
const faqcontrols = document.querySelector(".faq").querySelectorAll(".faq__control");
const questions = acc.querySelectorAll(".faq__question");
const answers = acc.querySelectorAll(".faq__answer");
for (let i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", function () {
        this.classList.toggle("faq__question--active");
        answers[i].classList.toggle("faq__answer--active");
    });
}
for (let i = 0; i < faqcontrols.length; i++) {
    faqcontrols[i].addEventListener("click", function () {
        if (faqcontrols[i].className.indexOf("deactivate") === -1) {
            answers.forEach(element => element.classList.toggle("faq__answer--active", false))
            questions.forEach(element => element.classList.toggle("faq__question--active", false))
        }
    });
}
// функция всего лишь добавляет CSS-класс, который и осуществляет анимацию
const scrollImations = (entries, observer) => {
    entries.forEach((entry) => {
        // анимируем, если элемент целиком попадает в отслеживаемую область
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            entry.target.classList.add('animation');
        }
    });
}

// создаём обсервер с параметрами
const options = {
    threshold: 0.5,
};
const observer = new IntersectionObserver(scrollImations, options);

const aboutTabs = document.querySelector('.about__tabs');
observer.observe(aboutTabs);
const aboutContent = document.querySelector('.about__content');
observer.observe(aboutContent);
const worksTitle = document.querySelector('.works h2');
observer.observe(worksTitle);
const worksItem = document.querySelectorAll('.works__item');
worksItem.forEach((content) => {
    observer.observe(content);
});
const technologyTitle = document.querySelector('.technology__title');
observer.observe(technologyTitle);
const technologyText = document.querySelectorAll('.technology__text');
technologyText.forEach((content) => {
    observer.observe(content);
});
const technologyButton = document.querySelector('.technology__button');
observer.observe(technologyButton);
const catalogTitle = document.querySelector('.catalog h2');
observer.observe(catalogTitle);
const trackersList = document.querySelector('.trackers__list');
observer.observe(trackersList);
const leashesList = document.querySelector('.leashes__list');
observer.observe(leashesList);
const rewiewsTitle = document.querySelector('.rewiews__title');
observer.observe(rewiewsTitle);
const rewiewsItem = document.querySelectorAll('.rewiews__item');
rewiewsItem.forEach((content) => {
    observer.observe(content);
});
const faqTitle = document.querySelector('.faq__title');
observer.observe(faqTitle);
const faqItem = document.querySelectorAll('.faq__item');
faqItem.forEach((content) => {
    observer.observe(content);
});
const headerMenu = document.querySelector('.header__menu');
const headerNav = document.querySelector('.header__nav');
const headerlinks = headerNav.querySelectorAll('a')
document.addEventListener('DOMContentLoaded', () => {
    headerMenu.addEventListener("click", (event) => {
        event.preventDefault()
        headerNav.classList.toggle("header__nav--active")
    })
    headerlinks.forEach(element => {
        element.addEventListener("click", () => {
            headerNav.classList.remove("header__nav--active")
        })
    })
})


const footerForm = document.querySelector('.footer__form')
const formSubmit = footerForm.querySelector('.form__submit');
const formFirstName = footerForm.querySelector('.form__first-name');
const formName = footerForm.querySelector('.form__name');
const formEmail = footerForm.querySelector('.form__e-mail');
const formTextarea = footerForm.querySelector('textarea');
formSubmit.addEventListener("click", (event) => {
    event.preventDefault()
    if (formFirstName.value !== '' && formName.value !== '' && formEmail.value !== '' && formTextarea.value !== '') {
        formSubmit.style.backgroundImage = "url('./img/check.svg')";
    }
})