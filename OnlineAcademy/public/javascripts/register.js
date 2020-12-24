$('#frmRegister').on('submit', function(e) {
    e.preventDefault();
    const inputEmail = $('#inputEmail').val();
    const passmatching = $('#message').text();
    $.getJSON(`/account/is-available?email=${inputEmail}`, function(data) {
        if (data === true) {
            if (passmatching === "Matching") {
                $('#frmRegister').off('submit').submit();
            }
        } else {
            $('#err_mess').text("Email already exists")
        }
    })
});
$('#inputPassword, #inputCfPassword').on('keyup', function() {
    if ($('#inputPassword').val() == $('#inputCfPassword').val()) {
        $('#message').html('Matching').css('color', 'green');
        console.log("match")
    } else {
        $('#message').html('Not Matching').css('color', 'red');
        console.log("not match");
    }
});