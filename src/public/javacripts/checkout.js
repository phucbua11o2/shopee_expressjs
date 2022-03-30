document.addEventListener("DOMContentLoaded", function() {
Stripe.setPublishableKey('pk_test_51KfIm2L2Q5xKtLuGdYqjHWwUKre1EKE8gqKyMHmqQP5Pg0iXz4SzJP9ofysTC2Jp2PpMehup8Z4nl34Vu3UMMSnx006tkylIF1');
var $form = $('checkout-form');
$form.submit(function(event) {
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('card-number').val(),
        cvc: $('card-cvc').val,
        exp_month: $('card-expiry-month').val(),
        exp_year: $('card-expiry-year').val(),
        name: $('card-name').val(),
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status,response) {
    if (response.error) {
        // Show the errors on the form
        // alert(response.error.message);
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('.button').prop('disabled',false);
    } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        // and submit
        $form.get(0).submit();
    }
}
})