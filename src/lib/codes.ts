import { randomInt } from "node:crypto";

// Tanpa huruf/angka yang mudah tertukar (0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const rand = (n: number) => Array.from({ length: n }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

export const orderCode = () => `MJP-2027-${rand(5)}`;
export const ticketCode = () => `MJP-${rand(5)}`;
export const ORDER_RE = /^MJP-2027-[A-Z0-9]{5}$/;
export const TICKET_RE = /^MJP-[A-Z0-9]{5}$/;
