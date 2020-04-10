
jQuery(function () {
    $("#calculon").on('click', function () {
        //return false;
    });
    $("form[name=calculon]").on('submit', function () {
        calculon();
        return false;
    });
});

alasql.promise('SELECT * FROM CSV("ranges.csv", {headers:true, quote:"\'",separator:","})').then(function (data) {
    alasqlBuildTable("ranges", data);
}).catch(function (err) {
    console.log('Error:', err);
});

const cardsPriority = ['a', 'k', 'q', 'j', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

function calculon() {
    $("#result, .fixedCard").addClass('d-none').html('');
    let players = parseFloat($("#players").val());
    let cards = ($("#cards").val() + '').toLowerCase().trim();
    let stack = parseFloat($("#stack").val());
    let position = $("#position").val();
    let cardss = cards.split("");
    let a = cardsPriority.indexOf(cardss[0]);
    let b = cardsPriority.indexOf(cardss[1]);
    if (b < a) {
        cards = cardss[1] + '' + cardss[0] + (cardss.length == 3 ? cardss[2] : '');
        $(".fixedCard").html(cards).removeClass('d-none');
    }
    let result = alasql("SELECT * FROM ranges WHERE players= ? AND cards=? AND stack_min<=? AND stack_max>=? AND position=?", [players, cards, stack, stack, position]);
    let print = result && result[0] ? result[0].result : 'N/A'
    $("#result").html(print).removeClass('d-none');
    console.log(result);
}