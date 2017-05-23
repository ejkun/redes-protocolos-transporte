async function stopAndWait(e) {
    delay = jQuery("#delay-stop-wait").val();
    e.preventDefault();
    clean(jQuery("#servidor-stop-wait"), jQuery("#cliente-stop-wait"));
    packets = jQuery("#packets-stop-wait").val();
    for (var i = 1; i <= packets; i++) {
        ack_atrasado = false;
        ack = false;
        reenviando = false;
        while (ack != true) {
            enviarPacote(jQuery("#servidor-stop-wait"), i, packets, reenviando);
            if (ack_atrasado) {
                recebeuAcknowledgment(jQuery("#servidor-stop-wait"));
                console.log("ACK do pacote "+i+" atrasou");
                ack = true;
            }
            success = (Math.random() > 0.3) || ack;
            await sleep(delay);
            if (success) {
                receberPacote(jQuery("#cliente-stop-wait"), i, packets);
                ack = (Math.random() > 0.1)
                ack_atrasado = (Math.random() > 0.8) && !ack_atrasado;
                await sleep(delay);
                if (ack == false) {
                    console.log("Pacote "+i+" não recebeu ACK, mas o cliente enviou");
                }
                if (ack && !ack_atrasado) {
                    recebeuAcknowledgment(jQuery("#servidor-stop-wait"));
                } else {
                    addTimeout(jQuery("#servidor-stop-wait"));
                }
                if (ack_atrasado) {
                    ack = false;
                }
            } else {
                addTimeout(jQuery("#servidor-stop-wait"));
                console.log("Pacote "+i+" não recebeu ACK");
            }
            reenviando = true;
        }
    }
}

function enviarPacote(servidor, numero, total, reenviando) {
    servidor.append(
        "<li class='mdl-list__item log-item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                (reenviando?"Reenviando":"Enviando")+" Pacote "+numero+" de "+total+
            "</span>"+
        "</li>"
    );
}

function receberPacote(cliente, numero, total) {
    cliente.append(
        "<li class='mdl-list__item mdl-list__item--two-line log-item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                "<span>Recebendo Pacote "+numero+" de "+total+"</span>"+
                "<span class='mdl-list__item-sub-title'>Enviando Acknowledgment</span>"+
            "</span>"+
        "</li>"
    );
}

function addTimeout(servidor) {
    servidor.append(
        "<li class='mdl-list__item log-item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                "<span class='mdl-color-text--red-800'>Timeout</span>"+
            "</span>"+
        "</li>"
    );
}

function recebeuAcknowledgment(servidor) {
    servidor.append(
        "<li class='mdl-list__item log-item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                "<span class='mdl-color-text--green-800'>Recebeu Acknowledgment</span>"+
            "</span>"+
        "</li>"
    );
}

function clean(servidor, cliente) {
    servidor.html(
        "<li class='mdl-list__item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                "<b>Servidor</b>"+
            "</span>"+
        "</li>"
    );

    cliente.html(
        "<li class='mdl-list__item'>"+
            "<span class='mdl-list__item-primary-content'>"+
                "<b>Cliente</b>"+
            "</span>"+
        "</li>"
    );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

jQuery(function () {
    jQuery("#stop-wait").submit(stopAndWait)
})