$("header .menu-bar button").click(() => {
    $(".menu-buttons").animate({
        width: "toggle",
    });
    // $('.menu-buttons').css('display', 'flex')
});

/* function that convert Date Object to YYYY-MM-DD string */
function getFormatDate(date) {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month < 10 ? "0" + month : month;
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    return `${year}${month}${day}`;
}