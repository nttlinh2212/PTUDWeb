$(document).on('click', '.wish_bt', function(event) {
    event.preventDefault();
    var id = $(this).attr("value");
    if ($(this).hasClass("wishing")) {
        $.getJSON(`/student/del-course-in-watch-list?CourseId=${id}`);
        $(this).removeClass("wishing");
    } else {
        $.getJSON(`/student/add-course-in-watch-list?CourseId=${id}`);
        $(this).addClass("wishing");
    }
});