
document.getElementById("progressbar").innerHTML = "Danh sách thiết bị";

var mydevice_tab = document.getElementById('mydevice-tab');
    myservice_tab = document.getElementById('myservice-tab');
	ServiceHistory_tab = document.getElementById('ServiceHistory-tab');
	breadcrumb = document.getElementById('breadcrumb');

    /*Content*/
    service = document.getElementById('myservice');
	device = document.getElementById('mydevice');
	ServiceHistory = document.getElementById('ServiceHistory');

    /*Initial view*/
    
    device.style.display='block';
    service.style.display='none';
    ServiceHistory.style.display='none';
 

/*Breadcumb*/
breadcrumb.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Danh sách thiết bị";

    mydevice_tab.className = "nav-item active";
    myservice_tab.className = "nav-item";
    ServiceHistory_tab.className = "nav-item";

    device.style.display='block';
    service.style.display='none';
    ServiceHistory.style.display='none';
});


mydevice_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Danh sách thiết bị";
    this.className = "nav-item active";
    myservice_tab.className = "nav-item";
    ServiceHistory_tab.className = "nav-item";

    device.style.display='block';
    service.style.display='none';
    ServiceHistory.style.display='none';
});

myservice_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Danh sách dịch vụ";

    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    ServiceHistory_tab.className = "nav-item";

    device.style.display='none';
    service.style.display='block';
    ServiceHistory.style.display='none';

}); 


ServiceHistory_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Lịch sử dịch vụ";
    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";

    device.style.display='none';
    service.style.display='none';
    ServiceHistory.style.display='block';
}); 

