import { Evento } from "../types/event";
import logo from "../assets/img-detalhes.png"

export const fetchEventos = async (): Promise<Evento[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    imagem: logo,
                    titulo: "Nome do Evento",
                    data: "Qui, 20 de fev - 19:00",
                    local: "Local do evento",
                    vendidos: "+ 100 mil vendidos",
                },
                {
                    id: 2,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 3,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 4,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 5,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 6,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 7,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 8,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 9,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 10,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 11,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 12,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 13,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 14,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 15,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
                {
                    id: 16,
                    imagem: logo,
                    titulo: "Outro Evento",
                    data: "Sex, 15 de mar - 21:00",
                    local: "Outro local",
                    vendidos: "+ 80 mil vendidos",
                },
            ]);
        }, 1000);
    });
};
