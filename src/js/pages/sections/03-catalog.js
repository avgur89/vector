import 'lightslider';
import { Resp } from '../../modules/dev/helpers';

class Main03 {
    constructor() {
        this.$slider = $('#brands');
        this.$nextSlide = $('.catalog__option__control__btn__next');
        this.$prevSlide = $('.catalog__option__control__btn__prev');
        this.$categoryItem = $('.category__item');
    }

    categoryMobile() {
        if (Resp.isMobile) {
            this.$categoryItem.on('click tap', function () {
                if ($(this).hasClass('active')) {
                    $('.category__item').removeClass('active');
                    $(this).find('.category__item__list').slideUp();
                    $(this).removeClass('active');
                } else {
                    $('.category__item').removeClass('active');
                    $('.category__item__list').slideUp();
                    $(this).find('.category__item__list').slideDown();
                    $(this).addClass('active');
                }
            });
        }
    }

    slideBrands() {
        this.$slick = this.$slider.lightSlider({
            item: 2,
            controls: false,
            slideMove: 1,
            pager: false,
            slideMargin: 0,
            onBeforeSlide: function (el) {
                $('#currentSlide').text(el.getCurrentSlideCount());
            },
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        item: 1,
                        slideMove: 1
                    }
                }
            ]
        });
        this.$nextSlide.on('click', (e) => {
            this.$slick.goToPrevSlide();
        });
        this.$prevSlide.on('click', (e) => {
            this.$slick.goToNextSlide();
        });
        $('#allSlide').text('/' + (this.$slick.getTotalSlideCount() - 1));
        if (Resp.isMobile) {
            $('#allSlide').text('/' + (this.$slick.getTotalSlideCount()));
        }
    }

    init() {
        this.slideBrands();
        this.categoryMobile();
    }

}

export default new Main03;
