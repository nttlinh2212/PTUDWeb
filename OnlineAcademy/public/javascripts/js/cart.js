function getCurrency(val) {
    return numeral(val).format('0,0') + ' Đ';
};
$(document).on("click", "#cart-list .remove", function(event) {
    event.preventDefault();
    const id = $(this).attr("value");
    $.getJSON(`/cart/remove?id=${id}`);
    $(this).closest('tr').remove();
    updateCart(-1);
    const price = $(this).attr("value-price");
    const totals = +($('#totals').text());
    $('#totals').text(getCurrency(totals - price));
})

$('#back').click(function() {
    parent.history.back();
    return false;
});