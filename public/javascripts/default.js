$('header .menu-bar button').click(()=>{
    console.log('clicked')
    $('.menu-buttons').animate({
        width:'toggle',
    });
    // $('.menu-buttons').css('display', 'flex')
})