let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

menuicn.addEventListener("click", () => {
    nav.classList.toggle("navclose");
})

document.addEventListener('DOMContentLoaded', function() {
    const productsSection = document.getElementById('products-section');
    const ordersSection = document.getElementById('orders-section');

    document.querySelector('.option2').addEventListener('click', function() {
        productsSection.classList.add('active');
        ordersSection.classList.remove('active');
    });

    document.querySelector('.option3').addEventListener('click', function() {
        ordersSection.classList.add('active');
        productsSection.classList.remove('active');
    });

    // Initially show the dashboard or whichever section you want
    productsSection.classList.add('active'); // or ordersSection.classList.add('active');
});