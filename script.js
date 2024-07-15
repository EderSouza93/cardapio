const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const streetInput = document.getElementById("rua");
const numberInput = document.getElementById("numero");
const complementInput = document.getElementById("complemento");
const bairroInput = document.getElementById("bairro");
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
    showToast("Item adicionado ao carrinho!", "#22c55e")
    
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

const validateAddressField = (input, warnElement) => {
    if (input.value.trim() === "") {
        input.classList.add("border-red-500");
        warnElement.classList.remove("hidden");
        return false;
    } else {
        input.classList.remove("border-red-500");
        warnElement.classList.add("hidden");
        return true;
    }
}

[streetInput, numberInput, bairroInput].forEach(input => {
    input.addEventListener("input", function(){
        validateAddressField(this.addressWarn);
    })
})

// Finalizar pedido
checkoutBtn.addEventListener("click",  async function(){ // essa função só é async caso a requisição seja por rest

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        showToast("Ops! O restaurante está fechado", "#ef4444")
        return;
    }
    if(cart.length === 0) { 
        showToast("Seu carrinho está vazio", "#ef4444")
        return;
    }

    const streetValid = validateAddressField(streetInput, addressWarn);
    const numberValid = validateAddressField(numberInput, addressWarn);
    const bairroValid = validateAddressField(bairroInput, addressWarn);

    if (!streetValid || !numberValid || !bairroValid) {
        showToast("Por favor, preencha todos os campos obrigatórios do endereço", "#ef4444");
        return;
    }

    // Enviar pedido para a api Whats - caso seja o envio pela api Wahtsapp a função deve deixar de ser async
    // const cartItems = cart.map((item) => {
    //     return (
    //         ` ${item.name} Quantidade: (${item.quantity} Preço: R$${item.price}) |`
    //     )
    // }).join(" | ")

    // const message = encodeURIComponent(cartItems)
    // const phone = "+5579998543128"

    // window.open(`https://wa.me/${phone}?text=${message} Endereço: ${streetInput.value}, numero ${numberInput.value}, ${complementInput.value}, bairro ${bairroInput.value}`, "_blank")

    // console.log("Pedido enviado:", cartItems);
    // showToast("Pedido enviado com sucesso!", "#22c55e")

    // Requisição por api

    // Mapeando os itens do carrinho 
     const cartItems = cart.map((item) => ({
         name: item.name,
         quantity: item.quantity,
         price: item.price
     }));

     const order = {
        orderType: 'delivery',
        items: cartItems,
        enderecoEntrega: {
            rua: 'Rua Exemplo',
            numero: '123',
            complemento: 'Apto 456',
            bairro: 'Centro',
        },   
         timestamp: new Date().toISOString()
     };

     console.log("Pedido a ser enviado:", order);
    
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Resposta do servidor:', result);
            showToast("Pedido enviado com sucesso!", "#22c55e");
        } else {
            throw new Error('Falha ao enviar o pedido');
        }
    } catch (error) {
        console.error('Erro:', error);
        showToast("Erro ao enviar o pedido", "#ef4444")
    }

    cart = [];
    updateCartModal();
})

const showToast = (message, backgroundColor) => {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: backgroundColor,
        },
    }).showToast();
}

// Verifica a hora e manipula o card do horário
const checkRestaurantOpen = () => {
    const data = new Date();
    const hora = data.getHours();
    const dia  = data.getDay();

    // Defini os dias em que o restaurante está fechado
    const diasFechados = [];

    // Verifica se o dia atual é um dos dias em que o restaurante está fechado 
    if(diasFechados.includes(dia)){
        return false;
    }
    // Verifica se o horário está dentro do horário de funcionamento. 
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