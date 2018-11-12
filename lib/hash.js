"use strict";

const crypto = require("crypto");

/**
 * ESTA FUNCION CREA UN HASH DEL TEXTO PASADO POR PARAMETRO CON EL ALGORITMO
 * DE ENCRIPTACION [MD5]
 * @param {*} str: TEXTO A ENCRIPTAR
 */
function hashMd5(str) {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
}

module.exports = {
  hashMd5
};
