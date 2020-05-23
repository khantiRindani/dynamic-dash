let waiting_sites = [];
//Load individual card for a site
function loadCard({site_name,url}) {

    let containers = document.querySelectorAll('.img_field');
    let root = containers[containers.length - 1];

    //Every container keeps at max 5 cards. Therefore, add new when needed/
    if (root.childElementCount >= 5) {
        let newRoot = document.createElement('div');
        newRoot.classList.add('img_field');
        newRoot.classList.add('scrolling-wrapper');
        root.parentNode.appendChild(newRoot);
        root = newRoot;
    }
    let card = document.createElement('div');
    card.classList.add("card");
    card.addEventListener('click',function(event){
        event.target.parentNode.scrollLeft += event.target.offsetWidth/2;
    });

    let a = document.createElement('a');
    a.href = `${url}`;
    card.appendChild(a);

    let field = document.createElement('img');
    field.src = `images/${site_name}.jpeg?dev=${Math.random()*100}`;
    field.alt = site_name;
    a.appendChild(field);

    let h2 = document.createElement('h2');
    h2.name = site_name;
    h2.innerHTML = site_name;
    card.appendChild(h2);

    let i = document.createElement('i');
    i.classList.add("fa");
    i.classList.add("fa-trash");
    let button = document.createElement('button');
    button.classList.add("delete");
    button.appendChild(i);
    card.appendChild(button);

    root.appendChild(card);
}
function changeCard(site_name){
    let cards = document.querySelectorAll('.card');
    for(card of cards){
        if(card.querySelector('h2').innerHTML === site_name){
            card.querySelector('img').src = `images/${site_name}.jpeg?dev=${Math.random()*100}`;
        }
    }
}

//Get Site-Images through API.
async function getImages() {
    const response = await fetch(`/getImages`);
    sites = await response.json();
    loadImages(sites);
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
    await response;
    siteElement.value = "";
    urlElement.value = "";
}

//Delete a site through API.
async function deleteSite(event) {
    let element = event.target;
    let site = element.parentNode.parentNode.querySelector('h2').name;
    const response = await fetch("/deleteSite", {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            site: site
        })
    });
    sites = await response.json();

    //Remove all cards, we will load again. It's necessary to fill the gap of card to be deleted.
    //Our other cards are spanned across different containers and are not siblings.
    let bar = document.querySelector('.diagonal-box');
    while (bar.firstChild) {
        //The list is LIVE so it will re-index each call
        bar.removeChild(bar.firstChild);
    }
    //Template for first
    let newRoot = document.createElement('div');
    newRoot.classList.add('img_field');
    newRoot.classList.add('scrolling-wrapper');
    bar.append(newRoot);
    //Load
    await loadImages(sites);
}

window.addEventListener("load", async function() {

    document.querySelector('#addSite').addEventListener('submit', async function(event) {
        event.preventDefault();
        await addSite();
    });

    let deleteBtns = document.querySelectorAll(".delete");
    for(btn of deleteBtns){
        btn.addEventListener('click', deleteSite);
    }
    await getImages();

    const socket = io();
    socket.on("connect", async function(){
         await fetch(`/captureImages?dev=${Math.random()*100}`);
    });
    socket.on("Image", function(res){
        if(waiting_sites.includes(res.site.site_name)){
            //console.log("condition checked");
            loadImages([res.site]);
            waiting_sites.splice(waiting_sites.indexOf(res.site.site_name),1);
        }
        else{
            //console.log("change received");
            //console.log(res.site);
            changeCard(res.site.site_name);
        }
    });
});
