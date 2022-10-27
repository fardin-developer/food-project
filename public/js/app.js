let addToCart = document.querySelectorAll('.add-to-cart');

const updateCart = async (pizza) => {


    const options = {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: pizza
    }

    await fetch('/update-cart', options)
}




addToCart.forEach((btn) => {
    btn.addEventListener('click', () => {
        let pizza = btn.dataset.pizza;
        pizza = JSON.parse(JSON.stringify(pizza));
        updateCart(pizza);
    });
});





