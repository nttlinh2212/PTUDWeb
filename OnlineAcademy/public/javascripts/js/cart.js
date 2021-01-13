$(document).on("click", "#cart-list a", function(event) {
    event.preventDefault();
    const id = $(this).attr("value");
    $.getJSON(`/cart/remove?id=${id}`);
    $(this).closest('tr').remove();
    const price = $(this).attr("value-price");
    const totals = +($('#totals').text());
    $('#totals').text(totals - price);
})

$('#back').click(function() {
    parent.history.back();
    return false;
});