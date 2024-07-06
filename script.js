const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = []

// Abrir modal do carrinho 
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Fechar o modal quando clicar em fechar 
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// Função que chama o addToCart através do click
menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price)
        }
})

// Função que percorre a array cart e verifica se o item já existe nela e acrescenta o mesmo 
const addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        // Se o item já existe, aumenta apenas a quantidade
        existingItem.quantity += 1;
        
    }else{
        // Se não existe acrescenta o objeto do item selecionado. 
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    // Atualiza a interface
    updateCartModal()
    Toastify({
        text: "Item adicionado ao carrinho!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#4caf50",
        },
      }).showToast()
    
}

// Atualiza o carrinho 
const updateCartModal = () => {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4" , "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
            </div>
            
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
            
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length
}

// Removendo itens do carrinho 
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeCartItem(name)
    }
})

const removeCartItem = (name) => {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal()
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast()
        return;
    }
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar pedido para a api Whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity} Preço: R$${item.price}) |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5579998543128"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    // // Requisição por api
    // // Mapeando os itens do carrinho 
    // const cartItems = cart.map((item) => ({
    //     name: item.name,
    //     quantity: item.quantity,
    //     price: item.price
    // }));

    // const order = {
    // orderType: 'delivery',
    // enderecoEntrega: {
    //   rua: 'Rua Exemplo',
    //   numero: '123',
    //   complemento: 'Apto 456',
    //   bairro: 'Centro',
    //   cidade: 'São Paulo',
    //   cep: '12345-678'
    //  },   
    //     items: cartItems,
    //     timestamp: new Date().toISOString()
    // };

    // console.log("Pedido a ser enviado:", order);
    
    // try {
    //     const response = await fetch('http://localhost:3000/api/orders', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(order)
    //     });

    //     if (response.ok) {
    //         const result = await response.json();
    //         console.log('Resposta do servidor:', result);
    //         Toastify({
    //             text: "Pedido enviado com sucesso!",
    //             duration: 3000,
    //             close: true,
    //             gravity: "top", // `top` or `bottom`
    //             position: "right", // `left`, `center` or `right`
    //             stopOnFocus: true, // Prevents dismissing of toast on hover
    //             style: {
    //               background: "#4caf50",
    //             },
    //           }).showToast();
    //     } else {
    //         throw new Error('Falha ao enviar o pedido');
    //     }
    // } catch (error) {
    //     console.error('Erro:', error);
    //     Toastify({
    //         text: "Erro ao enviar o pedido",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", // `top` or `bottom`
    //         position: "right", // `left`, `center` or `right`
    //         stopOnFocus: true, // Prevents dismissing of toast on hover
    //         style: {
    //           background: "#ef4444",
    //         },
    //       }).showToast();
    // }

    cart = []
    updateCartModal()
})

// Verifica a hora e manipula o card do horário
const checkRestaurantOpen = () => {
    const data = new Date();
    const hora = data.getHours();
    const dia  = data.getDay();

    const diasFechados = [1];

    if(diasFechados.includes(dia)){
        return false;
    }
    return hora >= 10 && hora < 22;
    //true o restaurante esta aberto
}

const spanItem = document.getElementById("date-span");
const openItem = document.getElementById("open-span");
const isOpen = checkRestaurantOpen();
const spanText = document.getElementById("text-span");

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
    openItem.classList.remove("bg-red-500")
    openItem.classList.add("bg-green-600")

}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
    openItem.classList.remove("bg-green-600")
    openItem.classList.add("bg-red-500")
    spanText.textContent = 'Fechado'
}