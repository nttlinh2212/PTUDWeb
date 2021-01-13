$('#searchbar').on('keydown', function(e) {
    var key = "'" + $('#searchbar').val() + "'";
    if (e.keyCode === 13) {
        e.preventDefault();
        $('#searchbar').val("'" + $('#searchbar').val() + "'");
        $('#searcharea').submit();
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
    $.getJSON(`/course/search/get-list-cat2?key=${key}`, function(data) {
        if (data.length != 0) {
            $('#resultbar').addClass("show");
            $('#searchdropdown').addClass("show");
            data.forEach(element => {
                $('#resultbar').append('<a href="/course/byCat2/' + element.Cat2ID + '" class="dropdown-item" style="color: black; font-size: 0.75rem;"> <i class="icon-th-large"></i> ' + element.Cat2Name + '</a>');
            });
        } else {
            haveres = true;
        }
    })
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

// $(document).ready(function() {
//     $('#addself').on('click', function() {
//         var button = $(this);
//         var cart = $('#cart');
//         var cartTotal = cart.attr('data-totalitems');
//         var newCartTotal = parseInt(cartTotal) + 1;

//         button.addClass('sendtocart');
//         setTimeout(function() {
//             button.removeClass('sendtocart');
//             cart.addClass('shake').attr('data-totalitems', newCartTotal);
//             setTimeout(function() {
//                 cart.removeClass('shake');
//             }, 500)
//         }, 1000)
//     })
// })