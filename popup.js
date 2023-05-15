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
    showScreen(CONST_SCREEN.LIST);
}


const showScreen = (strScreen) => {
    switch (strScreen) {
        case CONST_SCREEN.LIST:
            Menu.Show(strScreen);
            List.Show();
            break;
        case CONST_SCREEN.DETAIL:
            Detail.Show();
            break;
        default:
            break;
    }
}