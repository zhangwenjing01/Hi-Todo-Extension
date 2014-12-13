/**
 * 后台程序
 */
// 创建Todo
function create_todo(){

}
// 创建Todo（有选择文本）
function create_todo_select(info, tab){
    var text = encodeURIComponent(info.selectionText);
    chrome.tabs.sendMessage(tab.id, {method: "todo_with_content", content: text}, function(response) {
        var text = response;

    });
}
function share_to_hi(info, tab){
    var pageUrl = encodeURIComponent(tab.url);
    var title = encodeURI(tab.title);
    var imgUrl;
    var description = '';
    var apiUrl;
    // 异步回调请求数据
    chrome.tabs.sendMessage(tab.id, "getPageImg", function(response) {
        imgUrl = encodeURI(response);
        chrome.tabs.sendMessage(tab.id, "getPageDes", function(response) {
            description = encodeURI(response);
            apiUrl = "http://open.im.baidu.com/share/html/share.html?resourceUrl=" + pageUrl + "&pic=" + imgUrl + "&title=" + title + "&description=" + description + "&tip=" + encodeURI("来自百度Hi Todo浏览器扩展") + "&charset=UTF-8&rt=1";
            window.open(apiUrl);
        });
    });
}
// 创建二维码
function create_qrc(info, tab){
    chrome.tabs.sendMessage(tab.id, "createQRC");
}
// 右键菜单
chrome.contextMenus.create({"title": "创建Todo，关于「%s」", "contexts":["selection"], "onclick": create_todo_select});
chrome.contextMenus.create({"title": "创建Todo", "onclick": create_todo});
chrome.contextMenus.create({"title": "分享此页面到百度Hi", "onclick": share_to_hi});
chrome.contextMenus.create({"title": "网页二维码", "onclick": create_qrc});

// 创建桌面提醒
function create_desktop_notification(title, options)
{
    var notification;
    // Let's check if the browser supports notifications
    if(!("Notification" in window)){
        console.error("This browser does not support desktop notification");
    }
    // Let's check if the user is okay to get some notification
    else if(Notification.permission === "granted"){
        // If it's okay let's create a notification
       notification = new Notification(title, options);
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if(Notification.permission !== 'denied'){
        Notification.requestPermission(function(permission){
            if (permission === "granted") {
                notification = new Notification(title, options);
            }
            else{
                console.error("Notification request permission fail.");
            }
            console.log(Notification.permission);
        });
    }
    else{
        console.error("Notification denied.");
    }
    return notification;
}

// 设置一个定时器获取需要提醒的Todo
window.setInterval(function(){
    var title = "你有一个新的提醒";
    var iconURL = chrome.extension.getURL("img/logo-48x48.png");
    var options = {
        "dir": "auto",
        "body": "test",
        "icon": iconURL
    };
    var TodoNotification = create_desktop_notification(title, options);
    // 提醒设置成功后5s自动关闭
    if(TodoNotification !== undefined){
        setTimeout(function(){
            TodoNotification.close();
        },5000);
    }
    else{
        console.error("Create notification fail.");
    }
},10000);