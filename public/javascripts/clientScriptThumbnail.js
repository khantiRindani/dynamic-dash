let waiting_sites = [];
//Load individual card for a site
function loadCard({site_name,url}) {
    let root = document.querySelector('.img_field');

    let div = document.createElement('div');
    div.classList.add("card");

    let a = document.createElement('a');
    a.href = `${url}`;
    div.appendChild(a);

    let field = document.createElement('img');
    field.src = `images/${site_name}.jpeg?dev=${Math.random()*100}`;
    field.alt = site.site_name;
    a.appendChild(field);

    let h2 = document.createElement('h2');
    h2.innerHTML = `${site_name}`;
    div.appendChild(h2);

    let i = document.createElement('i');
    i.classList.add("fa");
    i.classList.add("fa-trash");
    let button = document.createElement('button');
    button.classList.add("delete");
    button.appendChild(i);
    div.appendChild(button);

    root.appendChild(div);
}
function changeCard({site_name,url}){
    let cards = document.querySelectorAll('.card');
    for(card of cards){
        if(card.querySelector('h2').innerHTML === site_name){
            field.src = `images/${site_name}.jpeg?dev=${Math.random()*100}`;
        }
    }
}
//Get Site-Images through API.
async function getImages() {
    const response = await fetch("/getImages");
    sites = await response.json();

    await loadImages(sites);
}

//Load the images.
function loadImages(sitesArray) {
    if (sitesArray.length == 0) exit();
    for(site of sitesArray){
        loadCard(site);
    }
    let deleteBtns = document.querySelectorAll(".delete");
    for(btn of deleteBtns){
        btn.addEventListener('click', deleteSite);
    }
}

//Add site through API.
async function addSite(event) {
    let siteElement = document.querySelector('#site')
    let urlElement = document.querySelector('#url');
    waiting_sites.push(siteElement.value);
    const response = await fetch("/addSite", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            site: siteElement.value,
            url: urlElement.value
        })
    });
    siteElement.value = "";
    urlElement.value = "";
    site = await response.json();
    console.log(site);
    loadImages([site]);
}

//Delete a site through API.
async function deleteSite(event) {
    let element = event.target;
    let site = element.parentNode.parentNode.querySelector('h2').innerHTML;
    await fetch("/deleteSite",{
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            site: site
        })
    });
    while (!element.classList.contains("card"))
        element = element.parentNode;
    element.parentNode.removeChild(element);
    if(element.parentNode.childElementCount==0)
        element.parentNode.parentNode.removeChild(element.parentNode);
}

window.addEventListener("load", function() {

    document.querySelector('#addSite').addEventListener('submit', async function(event) {
        event.preventDefault();
        await addSite();
    });
    let deleteBtns = document.querySelectorAll(".delete");
    for(btn of deleteBtns){
        btn.addEventListener('click', deleteSite);
    }
    getImages();
    var socket = io();
    socket.on("Image Ready", function(res){
        if(waiting_sites.includes(res.site.site_name)){
            console.log("condition checked");
            loadImages([res.site]);
            waiting_sites.splice(waiting_sites.indexOf(res.site.site_name),1);
        }else if(!waiting_sites.includes(res.site.site_name)){
            changeCard(res.site);
        }
    });
});
