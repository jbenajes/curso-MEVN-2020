<template>
  <div id="app">
    <div class="mb-5">
      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-brand href="#">app-mevn</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/login" v-if="!estaActivo">Login</b-nav-item>
            <b-nav-item to="/notas" v-if="estaActivo">Notas</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown right v-if="estaActivo">
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{usuarioDB.data.nombre}}</em>
              </template>
              <b-dropdown-item @click="cerrarSesion">Cerrar sesión</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  methods: {
    ...mapActions(['cerrarSesion', 'leerToken'])
  },
  computed: {
    ...mapGetters(['estaActivo']),
    ...mapState(['usuarioDB'])
  },
  created() {
    this.leerToken();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
