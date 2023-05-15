function ClassBooks() {
    this.Show = () => {
        initPage();
        addEvent();
    }

    const initPage = () => {
        let strHtml = "";
        strHtml += `<form>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat">Lấy dữ liệu ChatGpt</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="noidung">Nhập danh sách truyện:</label>`;
        strHtml += `   <textarea class="form-control" id="noidung" rows="5"></textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <button type="submit" class="btn btn-primary">Thêm mới</button>`;
        strHtml += `</form>`;
        //
        $('#Content').html(strHtml);
    }

    const addEvent = () => {
        $('.btn-get-chat').on("click", function () {
            getContentChatGpt(competeListBook);
        });
    }

    const competeListBook = (content) => {
        console.log(content);
        $('#noidung').val(content);
    }
}

const Books = new ClassBooks();