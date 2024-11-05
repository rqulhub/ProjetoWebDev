// garantia que código só rodará apos todos elementos estarem prontos
document.addEventListener("DOMContentLoaded", () => {
    // seleção de elementos do DOM
    const modal = document.getElementById("modal");
    const addDateBtn = document.getElementById("add-date-btn");
    const closeBtn = document.querySelector(".close");
    const dateForm = document.getElementById("date-form");
    const agendaContainer = document.getElementById("agenda-container");

    let editIndex = null; // Índice da data que está sendo editada

    // Função para formatar a data
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Dia com dois dígitos
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês com dois dígitos
        const year = date.getFullYear(); // Ano
        return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
    }

    // Abrir o modal
    addDateBtn.addEventListener("click", () => {
        modal.style.display = "block";
        dateForm.reset(); // Limpa o formulário ao abrir o modal
        editIndex = null; // Reseta o índice de edição
    });

    // Fechar o modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Salvar ou atualizar datas no localStorage
    dateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const date = document.getElementById("date").value;
        const apartment = document.getElementById("apartment").value;

        if (date && apartment) {
            // Obter dados existentes ou criar um array vazio
            let dates = JSON.parse(localStorage.getItem("dates")) || [];

            if (editIndex !== null) {
                // Atualizar data existente
                dates[editIndex] = { date, apartment };
                editIndex = null; // Resetar índice após a edição
            } else {
                // Adicionar nova data ao array
                dates.push({ date, apartment });
            }

            // Salvar no localStorage
            localStorage.setItem("dates", JSON.stringify(dates));

            // Limpar o formulário e fechar o modal
            dateForm.reset();
            modal.style.display = "none";

            // Atualizar a interface
            displayDates();
        }
    });

    // Função para exibir as datas na interface
    function displayDates() {
        agendaContainer.innerHTML = ""; // Limpar o container

        let dates = JSON.parse(localStorage.getItem("dates")) || [];

        dates.forEach((item, index) => {
            const dateItem = document.createElement("div");
            dateItem.classList.add("date-item");
            // Usar a função formatDate para formatar a data antes de exibir
            const formattedDate = formatDate(item.date);
            dateItem.innerHTML = `
                <p><strong>Data:</strong> ${formattedDate}</p>
                <p><strong>Apartamento:</strong> ${item.apartment}</p>
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Excluir</button>
            `;
            agendaContainer.appendChild(dateItem);
        });

        // Adicionar eventos de clique para editar e excluir
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", deleteDate);
        });

        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", editDate);
        });
    }

    // Função para excluir uma data
    function deleteDate(e) {
        let dates = JSON.parse(localStorage.getItem("dates")) || [];
        const index = e.target.getAttribute("data-index");

        dates.splice(index, 1); // Remover a data selecionada
        localStorage.setItem("dates", JSON.stringify(dates)); // Atualizar o localStorage
        displayDates(); // Atualizar a interface
    }

    // Função para editar uma data
    function editDate(e) {
        const index = e.target.getAttribute("data-index");
        let dates = JSON.parse(localStorage.getItem("dates")) || [];

        // Preencher o formulário com os dados da data selecionada
        document.getElementById("date").value = dates[index].date;
        document.getElementById("apartment").value = dates[index].apartment;

        // Exibir o modal
        modal.style.display = "block";
        editIndex = index; // Armazenar o índice da data sendo editada
    }

    // Exibir as datas ao carregar a página
    displayDates();
});
