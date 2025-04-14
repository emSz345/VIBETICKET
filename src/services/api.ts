import { Evento } from "../types/event";
import logo from "../assets/img-detalhes.png"

export const fetchEventos = async (): Promise<Evento[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    imagem: logo,
                    titulo: "Festival de Verão 2025",
                    data: "Qui, 20 de fev - 19:00",
                    local: "Praça Central - Taquaritinga",
                    vendidos: "+ 100 mil vendidos",
                },
                {
                    id: 2,
                    imagem: logo,
                    titulo: "Rock na Arena",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Arena Sul - Ribeirão Preto",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 3,
                    imagem: logo,
                    titulo: "Sunset Eletrônico",
                    data: "Sáb, 23 de mar - 18:00",
                    local: "Beach Club - Ubatuba",
                    vendidos: "+ 45 mil vendidos",
                },
                {
                    id: 4,
                    imagem: logo,
                    titulo: "Pagode das Antigas",
                    data: "Dom, 31 de mar - 16:00",
                    local: "Parque Municipal - Araraquara",
                    vendidos: "+ 60 mil vendidos",
                },
                {
                    id: 5,
                    imagem: logo,
                    titulo: "Festival Sertanejo",
                    data: "Sex, 05 de abr - 20:00",
                    local: "Estádio do Oeste - Catanduva",
                    vendidos: "+ 70 mil vendidos",
                },
                {
                    id: 6,
                    imagem: logo,
                    titulo: "Bailão Universitário",
                    data: "Sáb, 06 de abr - 22:00",
                    local: "Clube dos Estudantes - São Carlos",
                    vendidos: "+ 55 mil vendidos",
                },
                {
                    id: 7,
                    imagem: logo,
                    titulo: "Noite do Samba",
                    data: "Sex, 12 de abr - 19:30",
                    local: "Centro Cultural - Matão",
                    vendidos: "+ 40 mil vendidos",
                },
                {
                    id: 8,
                    imagem: logo,
                    titulo: "Trap Festival",
                    data: "Sáb, 13 de abr - 23:00",
                    local: "Espaço Open - Campinas",
                    vendidos: "+ 85 mil vendidos",
                },
                {
                    id: 9,
                    imagem: logo,
                    titulo: "Indie Fest Brasil",
                    data: "Dom, 14 de abr - 17:00",
                    local: "Teatro ao Ar Livre - Sorocaba",
                    vendidos: "+ 38 mil vendidos",
                },
                {
                    id: 10,
                    imagem: logo,
                    titulo: "Carnaval Fora de Época",
                    data: "Sáb, 20 de abr - 14:00",
                    local: "Avenida Principal - São José do Rio Preto",
                    vendidos: "+ 120 mil vendidos",
                },
                {
                    id: 11,
                    imagem: logo,
                    titulo: "Festival da Cerveja",
                    data: "Sex, 26 de abr - 18:00",
                    local: "Centro de Eventos - Franca",
                    vendidos: "+ 90 mil vendidos",
                }
            ]);
        }, 1000);
    });
};
