$('#frmRegister').on('submit', function(e) {
    e.preventDefault();
    var err = $('#err-message');
    err.text("");
    const fullname = $('#inputFullname').val();
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    const cfpassword = $('#inputCfPassword').val();
    if (email.length == 0 || password.length == 0 || fullname.length == 0 || cfpassword.length == 0) {
        err.text('Please fill in all fields!');
        return false;
    }
    if (!(email.includes('@') && email.includes('.') && email.length > 10 && email.length < 35)) {
        err.text('Please insert a valid email!');
        return false;
    }
    if (/^[a-zA-Z- ]*$/.test(fullname) == false) {
        err.text('Please insert a valid fullname!');
        return false;
    }
    if (password.length < 5 || password.length > 35) {
        err.text('Password must have more than 4 and less than 35 characters!');
        return false;
    }
    if (password != cfpassword) {
        err.text('Confirm password is incorrect!');
        return false;
    }
    $.getJSON(`/account/is-available?email=${email}`, function(data) {
        if (data === true) {
            $('#frmRegister').off('submit').submit();
        } else {
            $('#err-message').text("Email already exists")
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
    alert.slideDown(500, function() {
        alert.fadeTo(2000, 500).slideUp(500, function() {
            alert.slideUp(500);
        });
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