//Load individual card for a site
function loadCard({site_name,url,cat}) {
    let containers = document.querySelectorAll('.img-area');

    flag = false;
    for(var index=0;index<containers.length;index++){
        if(containers[index].getAttribute('name') == cat){
            flag = true;
            break;
        }
    }
    if(flag===false){
        loadCategory(cat);
        let control = document.querySelectorAll('.show-site');
        control[control.length-1].addEventListener('click', showAddSiteArea);
        control = document.querySelectorAll('.add-site-area');
        control[control.length-1].addEventListener('submit',async function(event) {
            event.preventDefault();

            await addSite(event);
        });
        index = containers.length;
        containers = document.querySelectorAll('.img-area');
    }

    let root = containers[index];
    let div = document.createElement('div');
    div.classList.add("card");

    let a = document.createElement('a');
    a.href = `${url}`;
    div.appendChild(a);

    let field = document.createElement('img');
    field.src = `images/${site_name}.png`;
    field.alt = site_name;
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

//Get Site-Images through API.
async function getImages() {
    const response = await fetch("/getImagesCat");
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

//New container for new category
function loadCategory(category){
    let bar = document.querySelector('.diagonal-box');

    let container = document.createElement('div');
    container.classList.add('container');
    container.setAttribute('name',category);

    let controlArea = document.createElement('div');
    controlArea.classList.add('control-area');
    container.appendChild(controlArea);

    let categoryLabel = document.createElement('h3');
    categoryLabel.classList.add('category-label');
    categoryLabel.innerHTML = category;

    let showSite = document.createElement('button');
    showSite.classList.add('show-site');
    showSite.innerHTML = 'Add';

    let addSiteArea = document.createElement('form');
    addSiteArea.classList.add('add-site-area');
    addSiteArea.setAttribute('name',category);
    let site = document.createElement('input');
    site.classList.add('site');
    site.placeholder = 'Site:';
    let url = document.createElement('input');
    url.classList.add('url');
    url.placeholder = 'URL:';
    let button = document.createElement('button');
    button.classList.add('add-site');
    button.style.type = 'submit';
    button.innerHTML = 'submit';
    addSiteArea.appendChild(site);
    addSiteArea.appendChild(url);
    addSiteArea.appendChild(button);

    controlArea.appendChild(categoryLabel);
    controlArea.appendChild(showSite);
    controlArea.appendChild(addSiteArea);

    let imgArea = document.createElement('div');
    imgArea.classList.add('scrolling-wrapper');
    imgArea.classList.add('img-area');
    imgArea.setAttribute('name',category);
    container.appendChild(imgArea);

    bar.appendChild(container);
}

//To toggle the form for adding site
function showAddSiteArea(event) {
    let root = event.target.parentNode;
    let siteArea = root.querySelector('.add-site-area')
    if(siteArea.style.visibility == 'hidden'){
        siteArea.style.visibility = 'visible';
        root.parentNode.querySelector('.img-area').style.marginLeft = '2rem';
    }else{
        siteArea.style.visibility = 'hidden';
        root.parentNode.querySelector('.img-area').style.marginLeft = '-12rem';
    }
}

//Add site through API.
async function addSite(event) {
    let siteElement = document.querySelector('#site')
    let urlElement = document.querySelector('#url');
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
    const response = await fetch("/deleteSiteCat", {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            site: site
        })
    });
    await response.json();

    while (!element.classList.contains("card"))
        element = element.parentNode;
    element.parentNode.removeChild(element);
}

window.addEventListener("load", function() {

    document.querySelector('#addCat').addEventListener('submit', function(event) {
        event.preventDefault();
        let catElement = document.querySelector('#category');
        loadCategory(catElement.value);
        let control = document.querySelectorAll('.show-site');
        control[control.length-1].addEventListener('click', showAddSiteArea);
        control = document.querySelectorAll('.add-site-area');
        control[control.length-1].addEventListener('submit',async function(event) {
            event.preventDefault();

            await addSite(event);
        });
    });

    document.querySelector('.show-site').addEventListener('click', showAddSiteArea);
    document.querySelector('.add-site-area').addEventListener('submit', async function(event) {
        event.preventDefault();

        await addSite(event);
    });
    getImages();
});
