$('#frmRegister').on('submit', function(e) {
    e.preventDefault();
    const inputEmail = $('#inputEmail').val();
    $.getJSON(`/account/is-available?email=${inputEmail}`, function(data) {
        if (data === true) {
            if ($('#inputPassword').val() === $('#inputCfPassword').val()) {
                $('#frmRegister').off('submit').submit();
            }
        } else {
            $('#err_mess').text("Email already exists")
        }
    })
});
$('#inputPassword, #inputCfPassword').on('keyup', function() {
    if ($('#inputPassword').val() === $('#inputCfPassword').val()) {
        $('#inputCfPassword').removeClass('border-danger')
        $('#inputCfPassword').addClass('border border-success')
    } else {
        $('#inputCfPassword').addClass('border border-danger thick-border')
    }
});
$('#back').click(function() {
    parent.history.back();
    return false;
});
$(document).ready(function() {
    $("#info-alert").hide();
    $("#password-alert").hide();
});
$("#info-alert").fadeTo(2000, 500).slideUp(500, function() {
    $("#info-alert").slideUp(500);
});
$("#password-alert").fadeTo(2000, 500).slideUp(500, function() {
    $("#password-alert").slideUp(500);
});

function showAlert(alert, success, message) {
    alert.html('<button type="button" class="close" data-dismiss="alert">x</button>');
    if (success) {
        if (alert.hasClass("alert-danger")) {
            alert.removeClass("alert-danger");
        }
        alert.addClass("alert-success")
        alert.append(message);
    } else {
        if (alert.hasClass("alert-success")) {
            alert.removeClass("alert-success");
        }
        alert.addClass("alert-danger")
        alert.append(message);
    }
    alert.fadeTo(2000, 500).slideUp(500, function() {
        alert.slideUp(500);
    });
}
$('#frm-info').on('submit', function(e) {
    e.preventDefault();
    const fullname = $('#inputFullname').val();
    const inputEmail = $('#inputEmail').val();
    const alert = $("#info-alert");
    if (fullname.length < 3 || fullname.length > 35) {
        $('#inputFullname').val("");
        showAlert(alert, false, 'Fullname must have more than 3 characters and less than 35 charaters!');
        return false;
    }
    if (!inputEmail.includes('@') || inputEmail.length < 3 || inputEmail.length > 35) {
        $('#inputEmail').val("");
        showAlert(alert, false, 'Please insert a valid email!');
        return false;
    }
    $.post("/student/update-info", { full_name: fullname, email: inputEmail }, function(result) {
        if (result) {
            showAlert(alert, result, '<strong>Success! </strong> Your information is changed successfully.');
        } else {
            $('#inputEmail').val("")
            showAlert(alert, result, '<strong>Sorry! </strong> This email is already existed.')
        }
    });
});

$('#frm-password').on('submit', function(e) {
    e.preventDefault();
    const oldPassword = $('#oldPassword').val();
    const inputPassword = $('#inputPassword').val();
    const inputCfPassword = $('#inputCfPassword').val();
    const alert = $("#password-alert");
    if (oldPassword.length == 0 || inputPassword == 0 || inputCfPassword == 0) {
        showAlert(alert, false, 'You must fill in all fields!');
        return false;
    }
    if (inputPassword.length < 5 || inputPassword.length > 35) {
        showAlert(alert, false, 'Password must have more than 5 characters and less than 35 charaters!');
        return false;
    }
    if (inputPassword != inputCfPassword) {
        showAlert(alert, false, 'Confirm password is wrong!');
        return false;
    }
    $.post("/student/change-password", { oldPassword: oldPassword, newPassword: inputPassword }, function(result) {
        if (result) {
            showAlert(alert, result, '<strong>Success! </strong> Your password is changed successfully.');
        } else {
            $('#oldPassword').val("")
            showAlert(alert, result, 'Your password is incorrect!')
        }
    });
});