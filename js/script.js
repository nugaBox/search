// 테마 세팅
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark")
}

let isdone = window.location.href;
if(isdone.substr(-5) != "false"){
    location.replace('?includeappcache=false');
}

let dark_theme = 0;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    dark_theme = 1;
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? dark_theme = 1 : dark_theme = 0;
});

let element_search = document.getElementById("search_form");
let element_search_text = document.getElementById("searchText");


function suggest_clear(){
    $("#keywords").html("");
    $(window).resize();
    card_max = 0; //Prevent unrefined when input became empty
}

let card_select = 0;
let card_max = 0;
let card_custom_max = 4;

function card_selection_update(w){
    if(w != null){card_select = w};
    for(i=1;i<card_max+1;i++){

        $("#card" + i).css("background-color",i == card_select && "rgb(10,206,114)" || (dark_theme && "rgb(64,64,64)" || "rgb(242,242,242)"));
        $("#card" + i).css("border-color",i == card_select && "rgb(10,206,114)" || (dark_theme && "rgb(64,64,64)" || "rgb(242,242,242)"));
        $("#card" + i).css("color",i == card_select && "white" || (dark_theme && "white" || "rgb(64,64,64)"));
    }
}

element_search_text.oninput = function(){
    let t = element_search_text.value;
    if(t.length === 0 || !t.trim()){suggest_clear();return;};
    $.ajax({
        dataType: "jsonp",
        url: 'https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=' + t,
        type: "GET",
        success: function(data){
            if(t==element_search_text.value){
                //$("#searchBox").css("max-width","600px");
                $("#card0").attr('keyword',t)
                $("#keywords").html("");
                card_max = 0;
                card_select = 0;
                $("#keywords").append("<li style='cursor:pointer' onClick='element_search_text.value = this.children[0].innerHTML;element_search.submit();' id='card1' onmouseenter='card_selection_update(1);' onmouseleave='card_selection_update(0);' keyword='" + t + "'><p>" + t + "</p></li>");
                card_max++;
                //default keyword selection which is basically search button.
                for (i = 0; i < card_custom_max; i++) {
                    if(data[1][i]){
                        if(data[1][i] == t){continue;};
                        $("#keywords").append("<li style='cursor:pointer' onClick='element_search_text.value = this.children[0].innerHTML;element_search.submit();' id='card" + (card_max + 1) + "' onmouseenter='card_selection_update(" + (card_max + 1) + ");' onmouseleave='card_selection_update(0);' keyword='" + data[1][i] + "'><p>" + data[1][i] + "</p></li>");
                        card_max++;
                    }
                };
                $(window).resize();
            }
        },
        error: suggest_clear
    });

}
element_search_text.onkeyup = function(event) {
    if((card_max != 0)){
        switch (event.keyCode) {
            case 38:
                event.preventDefault();
                //up
                card_select--;
                if (card_select < 0){card_select = card_max}
                card_selection_update();
                element_search_text.value = document.getElementById("card" + card_select).children[0].innerHTML;

                break;
            case 40:event.preventDefault();
                //down
                card_select++;
                if (card_select > card_max){card_select = 0}
                card_selection_update();
                element_search_text.value = document.getElementById("card" + card_select).children[0].innerHTML;
                break;

            default:

                break;
        }
    }

};

if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)){
    document.getElementById("main_link").href="http://m.naver.com";
    document.getElementById("noti_link").href="http://m.me.naver.com/noti.nhn";
    document.getElementById("more_link").href="https://m.naver.com/services.html";
    card_custom_max = 10;
}
