
jQuery(function () {
    $("#calculon").on('click', function () {
        $("#result").html('');
        calculon();
    });
});

alasql.promise('SELECT * FROM CSV("ranges.csv", {headers:true, quote:"\'",separator:","})').then(function (data) {
    alasqlBuildTable("ranges", data);
}).catch(function (err) {
    console.log('Error:', err);
});

const cardsPriority = ['a','k','q','j','10','9','8','7','6','5','4','3','2'];

function calculon() {
    let players = parseFloat($("#players").val());
    let cards = ($("#cards").val() + '').toLowerCase().trim();
    let stack = parseFloat($("#stack").val());
    let position = $("#position").val();
    let result = 'NULL';
    let result = alasql("SELECT * FROM ranges WHERE players= ? AND cards=? AND stack_min<=? AND stack_max>=? AND position=?", [players, cards, stack, stack, position]);
    let print = result && result[0] ? result[0].result : 'N/A'
    $("#result").html(print);
    console.log(result);
}