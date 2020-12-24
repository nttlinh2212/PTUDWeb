$('#frmRegister').on('submit', function() {
    $("#main-section").load("/account/sendOTP");
});