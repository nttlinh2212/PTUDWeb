$('#frmRegister').on('submit', function() {
    $("#main-section").load("/account/sendOTP");
});
$('.digit-group').find('input').each(function() {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function(e) {
        var parent = $($(this).parent());

        if (e.keyCode === 8 || e.keyCode === 37) {
            var prev = parent.find('input#' + $(this).data('previous'));

            if (prev.length) {
                $(prev).select();
            }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
            var next = parent.find('input#' + $(this).data('next'));

            if (next.length) {
                $(next).select();
            } else {
                if (parent.data('autosubmit')) {
                    parent.submit();
                }
            }
        }
    });
});

var counter = 60;

function startClock() {
    var interval = setInterval(function() {
        counter--;
        $('#countdown').text(counter);
        if (counter === 0) {
            $('#otp-expired-message-1').text("Your OTP is expired.");
            $('#otp-expired-message-2').text("Please click resend to receive a new OTP.")
            clearInterval(interval);
        }
    }, 1000);
}

$(document).ready(startClock());