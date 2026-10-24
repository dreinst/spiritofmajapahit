// Kontak resmi panitia: WhatsApp nomor kantor D'Production dan email care@dpro.events.
export const WA_NOMOR = "6282232999900";
export const WA_TAMPIL = "0822 3299 9900";
export const EMAIL = "care@dpro.events";
export const waLink = (pesan = "Halo panitia Majapahit Trail Run, saya ingin bertanya tentang acaranya.") => `https://wa.me/${WA_NOMOR}?text=${encodeURIComponent(`[Majapahit Trail Run] ${pesan}`)}`;
export const mailLink = (subjek = "Pertanyaan Majapahit Trail Run 2027") => `mailto:${EMAIL}?subject=${encodeURIComponent(subjek)}`;
