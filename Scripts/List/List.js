function ClassList() {
    let _objDatas = [];
    let _objEditor;
    let _objDataList;

    this.Show = (objData) => {
        if (objData) {
            _objDatas.push(objData);
        }
        //
        show();
    }
    this.Return = () => {
        let objData = getObjData();
        if (objData) {
            _objDatas.pop();
        }
        //
        show();
    }
    const show = () => {
        initData().then(function () {
            initPage();
            addEvent();
        });
    }

    const initData = async () => {
        const [error, response] = await _svGetList();
        if (_completeGetList(error, response) == false) {
            return;
        }
        //
        return true;
    }

    const _svGetList = async () => {
        let id;
        let objData = getObjData();
        if (objData) {
            id = objData.id
        } else {
            id = -1;
        }
        let objDataPara = { id: id };
        const [error, response] = await apiRequest.get("api/list/GetList", objDataPara);
        return [error, response];
    }
    //
    const _completeGetList = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        } else {
            _objDataList = response;
        }
        //
        return blnCheck;
    }

    const getObjData = () => {
        const intLength = _objDatas.length;
        if (intLength > 0) {
            return _objDatas[intLength - 1];
        } else {
            return null;
        }
    }

    const initPage = () => {
        let strHtml = "";
        let objData = getObjData();
        //
        strHtml += ` <div class="form-group">`;
        strHtml += `   <button type="button" id="btn-return" class="btn btn-primary">Trở lại</button>`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat">Lấy dữ liệu ChatGpt</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="title-list">Tiêu đề:</label>`;
        strHtml += `   <input class="form-control" id="title-list" ${objData ? `value="${objData.title}"` : ``}/>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="content-list">Danh sách:</label>`;
        strHtml += `   <textarea class="form-control" id="content-list" rows="5"></textarea>`;
        strHtml += ` </div>`;
        strHtml += ` <button type="submit" id="bln-list-add" class="btn btn-primary">Thêm mới</button>`;
        //
        strHtml += `<hr>`;
        //
        strHtml += `<table class="table">`;
        strHtml += `    <thead>`;
        strHtml += `        <tr>`;
        strHtml += `            <th>Name</th>`;
        strHtml += `            <th>Status</th>`;
        strHtml += `            <th>Actions</th>`;
        strHtml += `        </tr>`;
        strHtml += `    </thead>`;
        strHtml += `    <tbody>`;
        for (let index = 0; index < _objDataList.length; index++) {
            const objData = _objDataList[index];
            strHtml += `        <tr>`;
            strHtml += `            <td class="text-overflow">${objData.title}</td>`;
            strHtml += `            <td>${(objData.done == "1" ? `DONE` : ``)}</td>`;
            strHtml += `            <td>`;
            strHtml += `                <button indexlist=${index} class="btn btn-primary btn-sm btn-detail">Detail</button>`;
            strHtml += `                <button indexlist=${index} class="btn btn-info btn-sm btn-list">List</button>`;
            strHtml += `                <button indexlist=${index} class="btn btn-danger btn-sm btn-delete">Delete</button>`;
            strHtml += `            </td>`;
            strHtml += `        </tr>`;
        }
        strHtml += `    </tbody>`;
        //
        $('#Content').html(strHtml);
    }

    const addEvent = () => {
        ClassicEditor
            .create(document.querySelector('#content-list'))
            .then(editor => {
                _objEditor = editor;
            })
            .catch(error => {
                console.error(error);
            });
        $('.btn-get-chat').on("click", function () {
            getContentChatGpt(competeListBook);
        });
        $('#bln-list-add').on('click', addList);
        $('.btn-detail').on('click', List.clickDetail);
        $('.btn-list').on('click', clickList);
        $('.btn-delete').on('click', List.clickDelete);
        if (getObjData()) {
            $('#btn-return').on('click', clickReturn);
        } else {
            $('#btn-return').hide();
        }

    }

    this.clickDetail = () => {

    }

    function clickList() {
        let indexlist = $(this).attr("indexlist");
        List.Show(_objDataList[indexlist]);
    }

    function clickReturn() {
        List.Return();
    }

    const addList = async () => {
        let arrList = getData();
        //
        const [error, response] = await _svCreateList();
        if (_completeCreateList(error, response) == false) {
            return;
        }
        //
        show();
        //
        return false;
    }

    const _svCreateList = async () => {
        let objData = getData();
        const [error, response] = await apiRequest.post("api/list/create", objData);
        return [error, response];
    }
    //
    const _completeCreateList = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        }
        //
        return blnCheck;
    }

    const getData = () => {
        let id;
        let arrData = [];
        let objData = getObjData();
        if (objData) {
            id = objData.id
        } else {
            id = -1;
        }
        const div = document.createElement("div");
        let strData = _objEditor.getData(); // Assuming _objEditor is a reference to your CKEditor instance

        // Assigning the data to a temporary div element to extract the child elements
        div.innerHTML = strData;

        // Looping through the child elements and extracting their innerHTML
        for (let index = 0; index < div.children.length; index++) {
            const element = div.children[index];
            arrData.push({ pid: id, title: element.innerHTML, content: "", done: 0 });
        }

        return arrData; // Returning the array of extracted data
    };

    const competeListBook = (content) => {
        _objEditor.setData(content);
    }
}

const List = new ClassList();