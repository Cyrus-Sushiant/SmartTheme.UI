
//-----------------------------------------------------------------ShowAlert-----------------------------------------------------
//0 = success, 1 = error
function ShowAlert(type, title, text) {
    swal({
        title: title,
        text: text,
        html: true,
        confirmButtonText: 'بستن',
        confirmButtonColor: type === 0 ? '#52c466' : '#ff994c',
        type: type === 0 ? 'success' : 'error'
    });
}

function ShowAlertAndRedirect(title, text, confirmButtonText, url) {
    swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'نه، لغو عملیات !',
        closeOnConfirm: false,
        closeOnCancel: false,
        html: true
    },
        function (isConfirm) {
            if (isConfirm) {
                window.location = url;
            }
            else
                ShowAlert(1, 'لغو عملیات !', 'درخواست شما لغو شد.');
        });
}

function ShowConfirmAlert(title, text, funcConfirm) {
    swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'بله، آن را تایید کنید !',
        cancelButtonText: 'نه، لغو عملیات !',
        closeOnConfirm: false,
        closeOnCancel: true,
        showLoaderOnConfirm: true
    },
        function (isConfirm) {
            funcConfirm(isConfirm);
        });
}

//-----------------------------------------------------------------IsNullOrEmpty-----------------------------------------------------
function IsNullOrEmpty(value) {
    return (value === undefined || value === null || value === '');
}


function GetFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}

function FileIsImage(filename) {
    var exten = GetFileExtension(filename);
    if (exten === undefined) {
        return false;
    }

    switch (exten.toString().toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            return true;
        default:
            return false;
    }
}



function XOR(x, y) { return (x && !y) || (!x && y); }
function XNOR(x, y) { return !XOR(x, y); }

function SendPostRequest(url, data, funcConfirm) {
    SendRequest(url, data, 'POST', funcConfirm);
}

function SendPostRequestWithAntiforgery(url, data, funcConfirm) {
    if (data === undefined) {
        data = {};
    }
    var token = $('[name=__RequestVerificationToken]').val();
    data["__RequestVerificationToken"] = token;
    SendRequest(url, data, 'POST', funcConfirm);
}

function SendGetRequestWithAntiforgery(url, data, funcConfirm, funcError, htmlResult = false) {
    if (data === undefined) {
        data = {};
    }
    var token = $('[name=__RequestVerificationToken]').val();
    data["__RequestVerificationToken"] = token;
    SendRequest(url, data, 'GET', funcConfirm, funcError, htmlResult);
}

function SendGetRequest(url, data) {
    SendRequest(url, data, 'GET');
}

function SendRequest(url, data, type, funcConfirm, funcError, htmlResult = false) {
    $.ajax({
        url: url,
        data: data,
        success: function (result) {
            if (htmlResult) {
                funcConfirm(data, result);
            }
            else {
                if (result.Code === 0) {
                    ShowAlert(0, 'درخواست موفق !', result.Description);
                    if (funcConfirm !== undefined) {
                        funcConfirm(data, result);
                    }
                }
                else {
                    ShowAlert(1, 'خطا در انجام عملیات !', result.Description);
                }
            }
        },
        error: function (jqXHR, exception) {
            if (funcError !== undefined) {
                funcError(jqXHR, exception);
            }
            else {
                ShowErrorHttp(jqXHR, exception);
            }
        },
        type: type
    });
}

function ShowErrorHttp(jqXHR, exception) {
    var errorMessage = 'در پردازش درخواست شما خطایی رخ داده است. دوباره تلاش کنید.';
    var errorTitle = 'خطا در انجام عملیات !';
    if (jqXHR.status === 0) {
        errorMessage = 'خطا در انجام عملیات !', 'ارتباط شما قطع شده است، ارتباط اینترنت خود را بررسی کنید.';
    } else if (jqXHR.status === 404) {
        errorMessage = 'درخواست شما نا معتبر است';
    } else if (jqXHR.status === 500) {
        errorMessage = 'در پردازش درخواست شما خطایی رخ داده است. دوباره تلاش کنید.';
    } else if (jqXHR.status === 403) {
        errorTitle = 'دسترسی غیر مجاز';
        errorMessage = 'شما دسترسی به این بخش ندارید، با مدیر خود تماس بگیرید.';
    } else if (exception === 'parsererror') {
        //alert('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        //alert('Time out error.');
        errorMessage = 'ارتباط شما با سرور قطع شد، لطفا پس از بررسی مجدد در صورت لزوم دوباره درخواست خود را ارسال کنید.';
    } else if (exception === 'abort') {
        //alert('Ajax request aborted.');
    } else {
        //alert('Uncaught Error.n' + jqXHR.responseText);
    }
    ShowAlert(1, errorTitle, errorMessage);
    //if (jqXHR.status === 0) {
    //    alert('Not connect.n Verify Network.');
    //} else if (jqXHR.status == 404) {
    //    alert('Requested page not found. [404]');
    //} else if (jqXHR.status == 500) {
    //    alert('Internal Server Error [500].');
    //} else if (exception === 'parsererror') {
    //    alert('Requested JSON parse failed.');
    //} else if (exception === 'timeout') {
    //    alert('Time out error.');
    //} else if (exception === 'abort') {
    //    alert('Ajax request aborted.');
    //} else {
    //    alert('Uncaught Error.n' + jqXHR.responseText);
    //}
}

function SendPostRequest2(url, data) {
    SendRequest2(url, data, 'POST');
}

function SendGetRequest2(url, data) {
    SendRequest2(url, data, 'GET');
}

function SendRequest2(url, data, type) {
    $.ajax({
        url: url,
        data: data,
        success: function (result) {
            if (result.Code === 0) {
                ShowAlert(0, 'انجام موفق درخواست !', result.Description);
            }
            else {
                ShowAlert(1, 'خطا در انجام درخواست !', result.Description);
            }
        },
        error: function (jqXHR, exception) {
            var errorMessage = 'در پردازش درخواست شما خطایی رخ داده است. دوباره تلاش کنید.';
            var errorTitle = 'خطا در انجام عملیات !';
            if (jqXHR.status === 0) {
                errorMessage = 'خطا در انجام عملیات !', 'ارتباط شما قطع شده است، ارتباط اینترنت خود را بررسی کنید.';
            } else if (jqXHR.status === 404) {
                errorMessage = 'درخواست شما نا معتبر است';
            } else if (jqXHR.status === 500) {
                errorMessage = 'در پردازش درخواست شما خطایی رخ داده است. دوباره تلاش کنید.';
            } else if (jqXHR.status === 403) {
                errorTitle = 'دسترسی غیر مجاز';
                errorMessage = 'شما دسترسی به این بخش ندارید، با مدیر خود تماس بگیرید.';
            } else if (exception === 'parsererror') {
                //alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                //alert('Time out error.');
                errorMessage = 'ارتباط شما با سرور قطع شد، لطفا پس از بررسی مجدد در صورت لزوم دوباره درخواست خود را ارسال کنید.';
            } else if (exception === 'abort') {
                //alert('Ajax request aborted.');
            } else {
                //alert('Uncaught Error.n' + jqXHR.responseText);
            }
            ShowAlert(1, errorTitle, errorMessage);
            //if (jqXHR.status === 0) {
            //    alert('Not connect.n Verify Network.');
            //} else if (jqXHR.status == 404) {
            //    alert('Requested page not found. [404]');
            //} else if (jqXHR.status == 500) {
            //    alert('Internal Server Error [500].');
            //} else if (exception === 'parsererror') {
            //    alert('Requested JSON parse failed.');
            //} else if (exception === 'timeout') {
            //    alert('Time out error.');
            //} else if (exception === 'abort') {
            //    alert('Ajax request aborted.');
            //} else {
            //    alert('Uncaught Error.n' + jqXHR.responseText);
            //}
        },
        type: "POST"
    });
}

function stringIsNullOrEmpty(input) {
    if (input === undefined || input === null || input === '') {
        return true;
    }
    else {
        return false;
    }
}

function RedirectTo(url) {
    window.location = url;
}

function RefreshPage() {
    location.reload();
}

function CopyToClipboard(data) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(data).select();
    document.execCommand("copy");
    $temp.remove();
}

//-----------------------------------------------------------------Delete item from table-----------------------------------------------------
function ConfirmDelete(controller, id) {
    ShowConfirmAlert('آیا مطمئن به حذف هستید؟', 'شما قادر نخواهد بود برای بازیابی این آیتم کاری انجام دهید...', function (isConfirm) {
        if (isConfirm) {
            SendPostRequestWithAntiforgery('/' + controller + '/Delete', { id: id }, function (data) {
                $('#i' + id).fadeOut(600, function () {
                    $(this).remove();
                });
            })
        }
    });
}

function ConfirmDeleteFullUrl(controller, action, id) {
    ShowConfirmAlert('آیا مطمئن به حذف هستید؟', 'شما قادر نخواهد بود برای بازیابی این آیتم کاری انجام دهید...', function (isConfirm) {
        if (isConfirm) {
            SendPostRequestWithAntiforgery('/' + controller + '/' + action, { id: id }, function (data) {
                $('#i' + id).fadeOut(600, function () {
                    $(this).remove();
                });
            })
        }
    });
}

function initCKEditor(scope) {
    scope.editorOptions = {
        language: 'fa',
        toolbar: [
            //{ name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
            //{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
            //{ name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
            //{ name: 'colors', items: ['TextColor', 'BGColor'] },
            { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
        ],
        toolbarGroups: [
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
            { name: 'styles' },
            { name: 'colors' },
            { name: 'tools' },
        ]
    };
}

function initMap(title) {
    $('#pageTitleInMap').empty();
    $('#pageTitleInMap').text(title);
}

function GetStringEncoding(input) {
    if (input === undefined || input === null || input === '' || input === ' ') {
        return null;
    }
    else {
        return encodeURI(input);
    }
}

function GoToReport(url, formId) {
    var reportType = $('#ReportType').val();
    var serialized = $(formId).serialize().replace(/[^&]+=&/g, '').replace(/&[^&]+=$/g, '').replace(/[^&]+=\.?(?:&|$)/g, '');
    serialized = serialized.replace(/%2F/g, '-').replace(new RegExp("/", 'g'), "-");

    var rt = 'ReportType=' + reportType;
    serialized = serialized.replace(('&' + rt), '').replace(rt, '');

    url += ('/' + reportType);
    if (serialized != undefined && serialized != '') {
        url += ('?' + serialized);
    }


    window.open(url);
}

function GoToSendSMS(url, formId, smsType) {
    var reportType = $('#ReportType').val();
    var serialized = $(formId).serialize().replace(/[^&]+=&/g, '').replace(/&[^&]+=$/g, '').replace(/[^&]+=\.?(?:&|$)/g, '');
    serialized = serialized.replace(/%2F/g, '-').replace(new RegExp("/", 'g'), "-");

    var rt = 'ReportType=' + reportType;
    serialized = serialized.replace(('&' + rt), '').replace(rt, '');

    url += ('/' + smsType);
    if (serialized != undefined && serialized != '') {
        url += ('?' + serialized);
    }


    window.open(url);
}

function ResetForm() {
    $('#frm-search')[0].reset();
    $("#frm-search").submit();
}

function ShowLoading() {
    $('#loading').fadeIn('normal');
}


function HideLoading() {
    $('#loading').fadeOut('normal');
}