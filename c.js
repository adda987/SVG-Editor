'use strict';

let btnLinie = document.getElementById("linie");
let btnDreptunghi = document.getElementById("dreptunghi");
let btnElipsa = document.getElementById("elipsa");
let btnSelectie = document.getElementById("selectie");

let inputContur = document.getElementById("contur");
let inputUmplere = document.getElementById("umplere");
let inputGrosime = document.getElementById("grosime");

let btnUndo = document.getElementById("undo");
let btnSterge = document.getElementById("sterge");
let btnSalveaza = document.getElementById("salveaza");
let btnExport = document.getElementById("export");

let svg = document.getElementById("svg");

let elementAles = "selectie"; 
let desenez = false;         
let formaCurenta = null;
let elementSelectat = null; 

let startX = 0;
let startY = 0;
let istoric = []; 

btnSelectie.addEventListener("click", function(){
    elementAles = "selectie";
});

btnLinie.addEventListener("click", function(){
    elementAles = "linie";
   
});

btnDreptunghi.addEventListener("click", function(){
    elementAles = "dreptunghi";
  
});

btnElipsa.addEventListener("click", function(){
    elementAles = "elipsa";
   
});

svg.addEventListener("mousedown", function(e){       
    istoric.push(svg.innerHTML);

    startX = e.offsetX;
    startY = e.offsetY;
    desenez = true;

    if(elementAles === "selectie") {
        if(e.target !== svg) {
            elementSelectat = e.target;
            
            inputContur.value = elementSelectat.getAttribute("stroke");
            inputUmplere.value = elementSelectat.getAttribute("fill");
            inputGrosime.value = elementSelectat.getAttribute("stroke-width");
        }
        
    } else {
        let tag = ""; 
        if (elementAles === "dreptunghi") tag = "rect";
        else if (elementAles === "elipsa") tag = "ellipse";
        else if (elementAles === "linie") tag = "line";

        formaCurenta = document.createElementNS("http://www.w3.org/2000/svg", tag);
        
        formaCurenta.setAttribute("stroke", inputContur.value);
        formaCurenta.setAttribute("fill", inputUmplere.value);
        formaCurenta.setAttribute("stroke-width", inputGrosime.value);

        svg.appendChild(formaCurenta);
    }
});

svg.addEventListener("mousemove", function(e) {
    if (desenez === false) return; 

    let x = e.offsetX;
    let y = e.offsetY;

    if (elementAles === "selectie" && elementSelectat) {
        let dx = x - startX;
        let dy = y - startY;
        let tip = elementSelectat.tagName;

        if (tip === "rect") {
            let vechiX = parseFloat(elementSelectat.getAttribute("x"));
            let vechiY = parseFloat(elementSelectat.getAttribute("y"));
            elementSelectat.setAttribute("x", vechiX + dx);
            elementSelectat.setAttribute("y", vechiY + dy);
        } else if (tip === "ellipse") {
            let vechiCX = parseFloat(elementSelectat.getAttribute("cx"));
            let vechiCY = parseFloat(elementSelectat.getAttribute("cy"));
            elementSelectat.setAttribute("cx", vechiCX + dx);
            elementSelectat.setAttribute("cy", vechiCY + dy);
        } else if (tip === "line") {
            let x1 = parseFloat(elementSelectat.getAttribute("x1"));
            let y1 = parseFloat(elementSelectat.getAttribute("y1"));
            let x2 = parseFloat(elementSelectat.getAttribute("x2"));
            let y2 = parseFloat(elementSelectat.getAttribute("y2"));
            elementSelectat.setAttribute("x1", x1 + dx);
            elementSelectat.setAttribute("y1", y1 + dy);
            elementSelectat.setAttribute("x2", x2 + dx);
            elementSelectat.setAttribute("y2", y2 + dy);
        }
        startX = x;
        startY = y;

    } else if (formaCurenta) {
        if (elementAles === "linie") {
            formaCurenta.setAttribute("x1", startX);
            formaCurenta.setAttribute("y1", startY);
            formaCurenta.setAttribute("x2", x);
            formaCurenta.setAttribute("y2", y);
        } 
        else if (elementAles === "dreptunghi") {
            let w = Math.abs(x - startX);
            let h = Math.abs(y - startY);
            let newX = Math.min(x, startX);
            let newY = Math.min(y, startY);
            formaCurenta.setAttribute("width", w);
            formaCurenta.setAttribute("height", h);
            formaCurenta.setAttribute("x", newX);
            formaCurenta.setAttribute("y", newY);
        } 
        else if (elementAles === "elipsa") {
            let rx = Math.abs(x - startX);
            let ry = Math.abs(y - startY);
            formaCurenta.setAttribute("cx", startX);
            formaCurenta.setAttribute("cy", startY);
            formaCurenta.setAttribute("rx", rx);
            formaCurenta.setAttribute("ry", ry);
        }
    }
});

svg.addEventListener("mouseup", function() {
    desenez = false;       
    formaCurenta = null;   
});

btnUndo.addEventListener("click", function() {
    if(istoric.length > 0) {
        svg.innerHTML = istoric.pop();
        elementSelectat = null;
    }
});

btnSterge.addEventListener("click", function() {
    if(elementSelectat) {
        istoric.push(svg.innerHTML);
        svg.removeChild(elementSelectat);
        elementSelectat = null;
    }
});

btnSalveaza.addEventListener("click", function() {
    let data = svg.outerHTML;
    let blob = new Blob([data], {type: "image/svg+xml"});
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = "desen.svg";
    link.click();
});

btnExport.addEventListener("click", function() {
    let svgData = new XMLSerializer().serializeToString(svg);
    let blob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    let url = URL.createObjectURL(blob);
    let img = new Image();
    
    img.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = svg.clientWidth;
        canvas.height = svg.clientHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "desen.png";
        link.click();
    };
    img.src = url;
});