
document.getElementById("progressbar").innerHTML = "Thiết bị của tôi";

var mydevice_tab = document.getElementById('mydevice-tab');
    myservice_tab = document.getElementById('myservice-tab');
	chart_tab = document.getElementById('chart-tab');
	map_tab = document.getElementById('map-tab');
	warning_tab = document.getElementById('warning-tab');
	breadcrumb = document.getElementById('breadcrumb');

    /*Cards*/
    service_card = document.getElementById('service-card');
    chart_card = document.getElementById('chart-card');
    map_card = document.getElementById('map-card');
    warning_card = document.getElementById('warning-card');

    /*Content*/
    service = document.getElementById('myservice');
	device = document.getElementById('mydevice');
    map = document.getElementById('map');
	chart = document.getElementById('chart');
	warning = document.getElementById('warning');
	card = document.getElementById('card');

    /*Initial view*/
    card.style.display='block';
    
    service.style.display='none';
    device.style.display='block';
    chart.style.display='none';
    map.style.display='none';
    warning.style.display='none';
 

/*Breadcumb*/
breadcrumb.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Thiết bị của tôi";

    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item ";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='block';
    device.style.display='block';
    service.style.display='none';
    chart.style.display='none';
    map.style.display='none';
    warning.style.display='none';
});

/*card*/
service_card.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "services";

    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item active";
    map_tab.className = "nav-item ";
    chart_tab.className = "nav-item ";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='block';
    chart.style.display='none';
    map.style.display='none';
    warning.style.display='none';
});

chart_card.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Trạng thái cảm biến";

    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item ";
    chart_tab.className = "nav-item active";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    chart.style.display='block';
    map.style.display='none';
    warning.style.display='none';

});

map_card.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Hành trình";

    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item active";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    chart.style.display='none';
    map.style.display='block';
    warning.style.display='none';
}); 

warning_card.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Cảnh báo";

    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item active";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    chart.style.display='none';
    map.style.display='none';
    warning.style.display='block';
});


mydevice_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Thiết bị của tôi";
    this.className = "nav-item active";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='block';
    device.style.display='block';
    service.style.display='none';
    map.style.display='none';
    chart.style.display='none';
    warning.style.display='none';
});

myservice_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Dịch vụ của tôi";

    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    map_tab.className = "nav-item";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='block';
    map.style.display='none';
    chart.style.display='none';
    warning.style.display='none';

}); 

chart_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Trạng thái cảm biến";

    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    map_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    map.style.display='none';
    chart.style.display='block';
    warning.style.display='none';

}); 

map_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Hành trình";

    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    chart_tab.className = "nav-item";
    warning_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    map.style.display='block';
    chart.style.display='none';
    warning.style.display='none';

}); 

warning_tab.addEventListener('click', function (event) {
    document.getElementById("progressbar").innerHTML = "Cảnh báo";

    this.className = "nav-item active";
    mydevice_tab.className = "nav-item";
    myservice_tab.className = "nav-item";
    chart_tab.className = "nav-item";
    map_tab.className = "nav-item";

    card.style.display='none';
    device.style.display='none';
    service.style.display='none';
    map.style.display='none';
    chart.style.display='none';
    warning.style.display='block';
}); 

