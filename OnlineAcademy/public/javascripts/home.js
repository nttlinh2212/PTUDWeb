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

$('#searchbar').on('keydown', function(e) {
    var key = "'" + $('#searchbar').val() + "'";
    if (e.keyCode === 13) {
        e.preventDefault();
        $.getJSON(`/course/search?key=${key}`, function(data) {});
    }

    $('#resultbar').text("");
    var haveres = false;
    $.getJSON(`/course/search/get-list-courses?key=${key}&page=1`, function(data) {
            if (data.length != 0) {
                $('#resultbar').addClass("show");
                $('#searchdropdown').addClass("show");
                data.forEach(element => {
                    $('#resultbar').append('<a href="/course/detail/' + element.CourseID + '" class="dropdown-item" style="color: black; font-size: 0.75rem;"> <i class="icon-book-3"></i> ' + element.title + '</a>');
                });
            } else {
                haveres = true;
            }
        })
        // $.getJSON(`/course/search/get-list-cat2?key=${key}`, function(data) {
        //     if (data.length != 0) {
        //         $('#resultbar').addClass("show");
        //         $('#searchdropdown').addClass("show");
        //         //sai nen chua sua dc
        //         // data.forEach(element => {
        //         //     $('#resultbar').append('<a href="/course/detail/' + element.CourseID + '" class="dropdown-item" style="color: black; font-size: 0.75rem;"> <i class="icon-book-3"></i> ' + element.title + '</a>');
        //         // });
        //     } else {
        //         haveres = true;
        //     }
        // })
    if (haveres == false) {
        $('#resultbar').removeClass("show");
    }
})

window.onclick = function(event) {
    if (!event.target.matches('#searcharea')) {
        if ($('#resultbar').hasClass("show")) {
            $('#searchbar').val("");
            $('#resultbar').removeClass("show");
            $('#searchdropdown').removeClass("show");
        }
    }
}