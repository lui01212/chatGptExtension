function ClassDetail() {
    let _objData;
    let _objDetail;
    let _objEditor;

    this.Show = (objData) => {
        _objData = objData;
        //
        show();
    }

    const show = () => {
        initData().then(function () {
            initPage();
            addEvent();
        });
    };

    const addEvent = () => {
        ClassicEditor
            .create(document.querySelector('#content-detail'))
            .then(editor => {
                _objEditor = editor;
            })
            .catch(error => {
                console.error(error);
            });

        $('.btn-get-chat-content-detail').on("click", function () {
            getContentChatGpt(competeContentChatGpt);
        });

        $('.btn-get-chat-content-detail-plus').on("click", function () {
            getContentChatGpt(competeContentChatGptPlus);
        });
        
        $('.btn-chat-content-detail-continue').on("click", function () {
            let strChat = `continue`;
            chatChatGpt(strChat, competeContentChatGptPlus);
        });

        $('.btn-chat-content-detail').on("click", function () {
            let num = $('#num').val() != "" ? $('#num').val() : "2000";
            let strChat = `From now on, I want you to act as an SEO expert. The article has a high SEO ranking ability,In-depth analysis, no repetition of words, 100% human-like text, fluency, and paragraph breaks.The article must be more than ${num}+ words long.The platform limitations, the whole ${num}+ word article would need to be divided into 2 parts.Presented in font size: H1, H2, H3..v.v. Write a standard SEO article about: ${$('#title').val()} .
            `;
            chatChatGpt(strChat, competeContentChatGpt);
        });
        $('.btn-chat-still').on("click", function () {
            let strChat = `Still not 7000+ words .
            `;
            chatChatGpt(strChat, competeContentChatGpt);
        });

        $('.btn-get-chat-description').on("click", function () {
            getContentChatGpt(competeDescriptionChatGpt);
        });
        $('.btn-chat-description').on("click", function () {
            let strChat = `Create a short 25 word keyword description from the paragraph above`;
            chatChatGpt(strChat, competeDescriptionChatGpt);
        });
        //
        $('#btn-return').on('click', clickReturn);
        $('.bln-create').on('click', clickCreateDetail);
        $('#btn-posts').on('click', clickPosts);
    }

    function clickReturn() {
        List.Return();
    }

    this.createDetail = async () => {
        const [error, response] = await _svCreateDetail();
        if (_completeCreateDetail(error, response) == false) {
            return;
        }
        //
        show();
        //
        return false;
    }

    this.updateDetail = async (objData) => {
        const [error, response] = await _svUpdateDetail(objData);
        if (_completeUpdateDetail(error, response) == false) {
            return;
        }
        //
        show();
        //
        return false;
    }


    const _svUpdateDetail = async (objData) => {
        objData.title = $('#title').val();
        objData.key = $('#key').val();
        objData.description = $('#description').val();
        objData.content = _objEditor.getData();
        const [error, response] = await apiRequest.post("api/detail/update", objData);
        return [error, response];
    }

    const _completeUpdateDetail = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        }
        //
        return blnCheck;
    }

    function clickCreateDetail() {
        if (_objDetail) {
            Detail.updateDetail(_objDetail);
        } else {
            Detail.createDetail();
        }
    }

    const _svCreateDetail = async () => {
        let objData = {};
        objData.id = _objData.id;
        objData.title = $('#title').val();
        objData.content = _objEditor.getData();

        objData.content += `<!-- wp:block {"ref":8856} /-->`;
        objData.content += `<!-- wp:latest-posts /-->`;

        objData.link = '_'
        objData.key = $('#key').val();
        objData.description = $('#description').val();
        objData.cover_image = '_';
        objData.done = '0';
        //
        const [error, response] = await apiRequest.post("api/detail/create", objData);
        return [error, response];
    }

    const _completeCreateDetail = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        }
        //
        return blnCheck;
    }

    const competeContentChatGpt = (content) => {
        _objEditor.setData(content);
    }


    const competeContentChatGptPlus = (content) => {
        _objEditor.setData(_objEditor.getData() + content);
    }

    const competeDescriptionChatGpt = (content) => {
        $('#description').val(content);
    }

    const initData = async () => {
        const [error, response] = await _svGetDetail();
        if (_completeGetDetail(error, response) == false) {
            return;
        }
        //
        return true;
    }

    const _svGetDetail = async () => {
        const [error, response] = await apiRequest.get("api/detail/Get", _objData);
        return [error, response];
    }

    const _completeGetDetail = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        } else {
            _objDetail = response;
        }
        //
        return blnCheck;
    }
    async function clickPosts() {
        const [error, response] = await _svPostsCreate();
        if (_completePostsCreate(error, response) == false) {
            return;
        }
        //
        return true;
    }

    const _svPostsCreate = async () => {
        const [error, response] = await apiRequest.post("api/posts/create", _objDetail);
        return [error, response];
    }

    const _completePostsCreate = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        } else {
            alert("Đã tạo bài viết thành công");
        }
        //
        return blnCheck;
    }

    const initPage = () => {
        let strHtml = "";
        //
        strHtml += ` <div class="form-group">`;
        strHtml += `   <button type="button" id="btn-return" class="btn btn-primary">Trở lại</button>`;
        strHtml += `   <button type="button" id="btn-posts" class="btn btn-primary">Đăng bài</button>`;
        strHtml += ` <button type="submit" class="bln-create btn btn-primary">${_objDetail ? `Cập nhật` : `Thêm mới`}</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="title">Tiêu đề:</label>`;
        strHtml += `   <input class="form-control" id="title" ${_objDetail ? `value="${_objDetail.title}"` : `value="${_objData.title}"`}/>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="description">Mô tả:</label>`;
        strHtml += `   <textarea class="form-control" id="description" rows="5">${_objDetail ? _objDetail.description : ``}</textarea>`;
        strHtml += `   <hr>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat-description">Lấy dữ liệu ChatGpt</button>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-chat-description">ChatGpt</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="key">KeyWord:</label>`;
        strHtml += `   <textarea class="form-control" id="key" rows="3">${_objDetail ? _objDetail.key : ``}</textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="content-detail">Nội dung:</label>`;
        strHtml += `   <textarea class="form-control" id="content-detail" rows="5">${_objDetail ? _objDetail.content : ``}</textarea>`;
        strHtml += `   <hr>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat-content-detail">Lấy dữ liệu ChatGpt</button>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat-content-detail-plus">Lấy dữ liệu ChatGpt+</button>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-chat-content-detail">ChatGpt</button>`;
        strHtml += `   <input type="text" id="num" value="2000"/>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-chat-content-detail-continue">Continue</button>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-chat-still">Still ChatGpt</button>`;
        strHtml += ` </div>`;
        strHtml += ` <button type="submit" class="bln-create btn btn-primary">${_objDetail ? `Cập nhật` : `Thêm mới`}</button>`;
        //
        $('#Content').html(strHtml);
    }
}

const Detail = new ClassDetail();