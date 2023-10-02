import axios from 'axios';

const ConnectAPI = {
  url: 'https://data.oesteorganicos.com.br/api/',
  getUrl: function () {
    return this.url;
  },
  urlFile: function () {
    return this.url + 'storage/';
  },
  //get - listar
  //post - cadastrar
  //put - editar
  //delete - deletar
  call: async function (endpoint, data = null, method = 'GET', token = '') {
    try {
      const headers = {};
      headers[`Accept`] = `application/json;`;
      // headers[`Content-Type`] = `multipart/form-data`;
      token = `9|SyPefkzUsI8x1hfJ6HRCgqmdyueWgEdFCYocnVCb`;

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config = {
        method,
        url: this.url + endpoint,
        headers,
        data,
      };

      let response = await axios(config);

       if (response.status == 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      //throw JSON.stringify(error.response.data);
      throw error.response.data;
    }
  },
   errorCall: async function (error) {
    let titulo = error.message + ' nos campos abaixo:' + '\n';
    let msg = '';
    for (let index in error.data) {
      let tipoValidate = '';
      if (error.data[index] == 'validation.required') {
        tipoValidate = ' Campo obrigatório';
      }
      if (error.data[index] == 'validation.min.string') {
        tipoValidate = ' Quantidade mínima de caracteres';
      }
      if (error.data[index] == 'validation.max.string') {
        tipoValidate = ' Quantidade máxima de caracteres';
      }
      msg += index + ':' + tipoValidate + '\n';
    }
    return { titulo: titulo, msg: msg };
  },
};
export default ConnectAPI;
