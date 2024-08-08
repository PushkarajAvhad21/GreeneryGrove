var check=document.getElementsByClassName("check");
var head_admin=document.querySelector(".head_admin")
var mid_admin=document.querySelector(".mid_admin")
var del_admin=document.querySelector(".delete")
function check_fun(e){
    for(let i=0;i<check.length;i++){
        
        check.item(i).checked=false
    }
    e.target.checked=true
    if(check.item(0).checked==true){
        head_admin.style.display="block";
        mid_admin.style.display="none";
        del_admin.style.display="none";
    }
    else if(check.item(1).checked==true){
        mid_admin.style.display="block";
        head_admin.style.display="none";
        del_admin.style.display="none";
    }
    else if(check.item(2).checked==true){
        del_admin.style.display="block";
        head_admin.style.display="none";
        mid_admin.style.display="none";
    }
}

for(let i=0;i<check.length;i++){
    check[i].addEventListener('click',check_fun);
}
