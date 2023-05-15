function ClassMenu() {
    let objDataMenu = [
        {
            title: "List",
            screen: CONST_SCREEN.LIST
        }
    ];

    this.Show = (_menu) => {
        let strHtml = "";
        for (let index = 0; index < objDataMenu.length; index++) {
            const element = objDataMenu[index];
            strHtml += `<li class="nav-item ${_menu == element.screen ? `active` : ``}">`;
            strHtml += `<a class="nav-link text-primary" screen="${element.screen}">${element.title}</a>`;
            strHtml += `</li>`;
        }
        //
        $("#menu-navbar").html(strHtml);
        $(".nav-link").on("click", clickShowScreen);
    }

    function clickShowScreen() {
        let strScreen = $(this).attr("screen");
        showScreen(strScreen);
    }
}

const Menu = new ClassMenu(); 