<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="email" placeholder="Email" class="form-control my-2"
        v-model="usuario.email">
      <input type="password" placeholder="Contraseña" class="form-control my-2"
        v-model="usuario.pass">
      <b-button class="btn-block mb-2" type="submit">Acceder</b-button>
    </form>
    <div v-if="mensaje !== ''">
      <p>{{mensaje}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      usuario: { email: '', pass: '' },
      mensaje: ''
    }
  },
  methods: {
    ...mapActions(['guardarUsuario']),
    login() {
      this.axios.post('/login', this.usuario)
        .then(res => {
          const token = res.data.token;
          this.guardarUsuario(token);
          this.$router.push({ name: 'Notas' });
        })
        .catch(e => {
          this.mensaje = e.response.data.mensaje;
        })
    }
  },
}
</script>