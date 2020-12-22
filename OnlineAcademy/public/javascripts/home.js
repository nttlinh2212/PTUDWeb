$("#reccomended").owlCarousel({
    loop: true,
    autoplay: true,
    autoplayTimeout: 7000,
})
$("#top10CoursesByViews").owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 7000,
    autoplayHoverPause: true,
    responsiveClass: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 4,
            nav: true
        }
    }
});

$("#top10NewCourses").owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsiveClass: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 4,
            nav: true
        }
    }
});

function calStar(array) {
    return round(array[0] + array[1] * 2 + array[2] * 3 + array[3] * 4 + array[4] * 5);
}