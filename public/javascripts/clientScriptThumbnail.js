function loadCard({site_name,url}) {
    let containers = document.querySelectorAll('.img_field');
    let root = containers[containers.length-1];

    let div = document.createElement('div');
    div.classList.add("card");

    let a = document.createElement('a');
    a.href = `${url}`;
    div.appendChild(a);

    let field = document.createElement('img');
    field.src = `images/${site_name}.png`;
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

function deleteAction() {
    let deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((btn, index, array) => {
        btn.addEventListener('click', async function(event) {
            console.log('called');
            let element = event.target;
            let site = element.parentNode.parentNode.querySelector('h2').innerHTML;
            await fetch("http://localhost:3000/deleteSite",{
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
            changeLayout();
        });
    });
}
async function getImages() {
    const response = await fetch("http://localhost:3000/getImages");
    sites = await response.json();

    await loadImages(sites);
}
function changeLayout(){
    let wrapper = document.querySelector('.scrolling-wrapper');
    if(wrapper.childElementCount<=5){
        wrapper.style.display = 'flex';
        wrapper.style.overflow = 'scroll';
        wrapper.style.padding = '3rem';
        wrapper.style.transform = 'skewY(11deg)';
    }else{
        wrapper.style.display = 'flex';
        wrapper.style.flexWrap = 'wrap';
        wrapper.style.padding = '3rem';
        wrapper.style.transform= 'skewY(11deg)';
    }
}
function loadImages(sites) {
    if (sites.length == 0) exit();
    sites.forEach((site, index, array) => {
        loadCard(site);
    });
    deleteAction();
    changeLayout();
}
window.addEventListener("load", function() {
    async function send(event) {
        let siteElement = document.querySelector('#site')
        let urlElement = document.querySelector('#url');
        const response = await fetch("http://localhost:3000/addSite", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                site: site.value,
                url: url.value
            })
        });
        siteElement.value="";
        urlElement.value="";
        sites = await response.json();
        console.log(sites);
        loadImages(sites);
    }
    document.querySelector('#addSite').addEventListener('submit', function(event){
        event.preventDefault();

        send();
    });
    getImages();
});
