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

        $('.btn-get-chat').on("click", function () {
            getContentChatGpt(competeContentChatGpt);
        });

        //
        $('#btn-return').on('click', clickReturn);
        $('#bln-create').on('click', clickCreateDetail);
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
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat">Lấy dữ liệu ChatGpt</button>`;
        strHtml += `   <button type="button" id="btn-posts" class="btn btn-primary">Đăng bài</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="title">Tiêu đề:</label>`;
        strHtml += `   <input class="form-control" id="title" ${_objDetail ? `value="${_objDetail.title}"` : `value="${_objData.title}"`}/>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="description">Mô tả:</label>`;
        strHtml += `   <textarea class="form-control" id="description" rows="5">${_objDetail ? _objDetail.description : ``}</textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="key">KeyWord:</label>`;
        strHtml += `   <textarea class="form-control" id="key" rows="3">${_objDetail ? _objDetail.key : ``}</textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="content-detail">Nội dung:</label>`;
        strHtml += `   <textarea class="form-control" id="content-detail" rows="5">${_objDetail ? _objDetail.content : ``}</textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <button type="submit" id="bln-create" class="btn btn-primary">${_objDetail ? `Cập nhật` : `Thêm mới`}</button>`;
        //
        $('#Content').html(strHtml);
    }
}

const Detail = new ClassDetail();