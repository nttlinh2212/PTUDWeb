function getCurrency(val) {
    return numeral(val).format('0,0') + ' Đ';
};

function getStar(star1, star2, star3, star4, star5) {
    return (star1 + star2 * 2 + star3 * 3 + star4 * 4 + star5 * 5) / (star1 + star2 + star3 + star4 + star5);
};

function parseHTML(element) {
    var fullhtml = "";
    var html = '<div class="box_list wow"> <div class="row no-gutters">  <div class="col-lg-5">  <figure class="block-reveal">  <div class="block-horizzontal"></div>  <a href="detail/element.CourseID"><img src="/images/courses/element.CourseID/main.jpg" class="img-fluid" alt=""></a>  <div class="preview"><span>Preview course</span></div>  </figure>  </div>  <div class="col-lg-7">  <div class="wrapper">  <a href="#0" class="wish_bt"></a>'
    fullhtml += html.replaceAll("element.CourseID", element.CourseID);
    if (element.promotional_price < element.price) {
        html = '<div class="price">  <span>element.promotional_price</span>  <small><del>element.price</del></small>  </div>';
        var replace = html.replaceAll("element.promotional_price", getCurrency(element.promotional_price));
        fullhtml += replace.replaceAll("element.price", getCurrency(element.price));
    } else {
        html = '<div class="price">element.price</div>';
        fullhtml += html.replaceAll("element.price", getCurrency(element.price));
    }
    html = '<small>element.Cat2Name</small>  <h3>element.title</h3>  <h6>element.full_name</h6>  <p>element.brief_des</p>  <div class="rating">';
    var replace = html.replace("element.Cat2Name", element.Cat2Name);
    replace = replace.replace("element.title", element.title);
    replace = replace.replace("element.full_name", element.full_name);
    replace = replace.replace("element.brief_des", element.brief_des);
    fullhtml += replace;
    var star = getStar(element.star1, element.star2, element.star3, element.star4, element.star5);
    for (var j = 0; j < 5; j++) {
        if (j < star) {
            fullhtml += '<i class="icon_star voted "></i>';
        } else {
            fullhtml += '<i class="icon_star "></i>';
        }
    }
    html = '</div>  <ul>  <li><i class="icon_clock_alt"></i> element.duration</li>  <li><i class="icon-eye"></i>  element.views  </li>  <li><a href="detail/element.CourseID">Enroll now</a></li>  </ul>  </div>  </div> </div> </div>';
    var replace = html.replace("element.duration", element.duration);
    replace = replace.replace("element.views", element.views);
    fullhtml += replace.replace("element.CourseID", element.CourseID);
    return fullhtml;
}

function parsePaginator(page, nPages) {
    page = +(page);
    nPages = +(nPages);
    var fullhtml = "";
    var html = '<ul class="pagination justify-content-center">';
    fullhtml += html;
    if (page === 1) {
        fullhtml += '<li class="page-item disabled"><a class="page-link" href="javascript:;">Previous</a></li>';
    } else {
        html = '<li class="page-item"><a class="page-link" value="pageindex" href="javascript:;">Previous</a></li>';
        fullhtml += html.replace("pageindex", page - 1);
    }
    var start = page - 1;
    var end = page + 1;
    if (start < 1) {
        start = 1;
        end += 1;
    }
    if (end > nPages) {
        end = nPages;
        if (start > 1)
            start -= 1;
    }
    for (var i = start; i <= end; i++) {
        if (i === page) {
            html = '<li class="page-item disabled"><a class="page-link" href="javascript:;">pageindex</a></li>';
        } else {
            html = '<li class="page-item"><a class="page-link" href="javasript:;">pageindex</a></li>';
        }
        fullhtml += html.replace("pageindex", i);
    }
    if (page === nPages) {
        fullhtml += '<li class="page-item disabled"><a class="page-link" href="javascript:;">Next</a></li></ul></nav>';
    } else {
        html = '<li class="page-item"><a class="page-link" value="pageindex" href="javascript:;">Next</a></li></ul></nav>';
        fullhtml += html.replace("pageindex", page + 1);
    }
    return fullhtml;
}
$(document).on("change", '#sort-option', function() {
    var value = $(this).val();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const key = urlParams.get('key');
    var nPages = $('#nPages').val();
    if (value != "all") {
        $.getJSON(`/course/search/get-list-courses-${value}?key=${key}&page=1`, function(data) {
            if (data.length != 0) {
                $('#list-courses').text("");
                data.forEach(element => {
                    var fullhtml = parseHTML(element);
                    $('#list-courses').append(fullhtml);
                });
            }
        });
    }
    var paginator = parsePaginator(1, nPages);
    $('#paginator').html(paginator);
});

$(document).on("click", "#paginator a", function(event) {
    event.preventDefault();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const key = urlParams.get('key');
    var page = $(this).text();
    var nPages = $('#nPages').val();
    if (page === "Previous" || page === "Next") {
        page = $(this).attr('value');
    }
    var type = $('#sort-option').val();
    if (type === "all") {
        $.getJSON(`/course/search/get-list-courses?key=${key}&page=${page}`, function(data) {
            if (data.length != 0) {
                $('#list-courses').text("");
                data.forEach(element => {
                    var fullhtml = parseHTML(element);
                    $('#list-courses').append(fullhtml);
                });
            }
        });
    } else {
        $.getJSON(`/course/search/get-list-courses-${type}?key=${key}&page=${page}`, function(data) {
            if (data.length != 0) {
                $('#list-courses').text("");
                data.forEach(element => {
                    var fullhtml = parseHTML(element);
                    $('#list-courses').append(fullhtml);
                });
            }
        });
    }
    var paginator = parsePaginator(page, nPages);
    $('#paginator').html(paginator);
});