window.onload = () => {
    try {
        if (typeof onStartUp != "undefined") {
            //
            onStartUp();
        }
    } catch (ex) {
        alert(ex);
    }
};

const onStartUp = () => {
    showScreen(CONST_SCREEN.LIST_MANGA);
}


const showScreen = (strScreen) => {
    switch (strScreen) {
        case CONST_SCREEN.LIST_MANGA:
            Menu.Show(strScreen);
            Books.Show();
            break;
        case CONST_SCREEN.MANGA_DETAIL:
            BookDetail.Show();
            break;
        case CONST_SCREEN.LIST_NHAN_VAT:
            Menu.Show(strScreen);
            break;
        default:
            break;
    }
}