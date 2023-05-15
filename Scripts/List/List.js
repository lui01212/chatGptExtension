function ClassList() {
    let _ids = {};
    let _objEditor;
    let _objDataList;

    this.Show = (id) => {
        if (id) {
            _ids.push(id);
        }
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
        let objData = { id: getId() };
        const [error, response] = await apiRequest.get("api/list/GetList", objData);
        return [error, response];
    }
    //
    const _completeGetList = async (error, response) => {
        let blnCheck = true;
        if (error) {
            alert(error);
        } else {
            _objDataList = response;
            console.log(_objDataList);
        }
        //
        return blnCheck;
    }

    const getId = () => {
        const intLength = _ids.length;
        if (intLength > 0) {
            return _ids[intLength - 1];
        } else {
            return -1;
        }
    }

    const initPage = () => {
        let strHtml = "";
        strHtml += ` <div class="form-group">`;
        strHtml += `   <button type="button" class="btn btn-primary btn-get-chat">Lấy dữ liệu ChatGpt</button>`;
        strHtml += ` </div>`;
        strHtml += ` <div class="form-group">`;
        strHtml += `   <label for="noidung">Tiêu đề:</label>`;
        strHtml += `   <input class="form-control" id="title-list"/>`;
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
            strHtml += `                <button indexlist=${index} class="btn btn-primary btn-sm">Detail</button>`;
            strHtml += `                <button indexlist=${index} class="btn btn-info btn-sm">List</button>`;
            strHtml += `                <button indexlist=${index} class="btn btn-danger btn-sm">Delete</button>`;
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
        let arrData = [];
        const div = document.createElement("div");
        let strData = _objEditor.getData(); // Assuming _objEditor is a reference to your CKEditor instance

        // Assigning the data to a temporary div element to extract the child elements
        div.innerHTML = strData;

        // Looping through the child elements and extracting their innerHTML
        for (let index = 0; index < div.children.length; index++) {
            const element = div.children[index];
            arrData.push({ pid: getId(), title: element.innerHTML, content: "", done: 0 });
        }

        return arrData; // Returning the array of extracted data
    };

    const competeListBook = (content) => {
        _objEditor.setData(content);
    }
}

const List = new ClassList();