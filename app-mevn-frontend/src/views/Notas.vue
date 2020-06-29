<<template>
  <div class="container">
    <h1>Notas</h1>
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="mensaje.color"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      {{mensaje.texto}}
    </b-alert>

    <form @submit.prevent="editarNota(notaEditar)" v-if="modoEdicion">
      <h3>Editar nota</h3>
      <input type="text" class="form-control my-2" placeholder="Nombre"
      v-model="notaEditar.nombre">
      <input type="text" class="form-control my-2" placeholder="Descripción"
      v-model="notaEditar.descripcion">
      <b-button class="btn-warning my-2 mx-2" type="submit">Editar</b-button>
      <b-button class="my-2" type="submit" @click="modoEdicion = false">Cancelar</b-button>
    </form>

    <form @submit.prevent="anyadirNota()" v-if="!modoEdicion">
      <h3>Añadir nueva nota</h3>
      <input type="text" class="form-control my-2" placeholder="Nombre"
      v-model="nota.nombre">
      <input type="text" class="form-control my-2" placeholder="Descripción"
      v-model="nota.descripcion">
      <b-button class="btn-success my-2 btn-block" type="submit">Añadir</b-button>
    </form>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{item._id}}</th>
          <td>{{item.nombre}}</td>
          <td>{{item.descripcion}}</td>
          <td>
            <b-button @click="activarEdicion(item._id)" 
              class="btn-warning btn-sm mx-2">Editar
            </b-button>
            <b-button @click="eliminarNota(item._id)" 
              class="btn-danger btn-sm">Eliminar
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': paginaActual === 1 }">
          <router-link :to="{ query: { pagina: paginaActual - 1 }}"  
          class="page-link">Anterior</router-link>
        </li>
        <li class="page-item" :class="{ 'active': paginaActual === index + 1 }"
        v-for="(item, index) in cantidadPaginas" :key="index">
          <router-link :to="{ query: { pagina: index + 1 }}" 
          class="page-link">{{ index + 1 }}</router-link>
        </li>
        <li class="page-item" :class="{ 'disabled': paginaActual === cantidadPaginas }">
          <router-link :to="{ query: { pagina: paginaActual + 1 }}" 
          class="page-link">Siguiente</router-link>
        </li>
      </ul>
    </nav>

    <p>Total notas: {{ totalNotas }} - Cantidad de páginas: {{ cantidadPaginas }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      notas: [],
      dismissCountDown: 0,
      dismissSecs: 5,
      mensaje: { color: '', texto: '' },
      nota: { nombre: '', descripcion: '' },
      modoEdicion: false,
      notaEditar: {},
      totalNotas: 0,
      limite: 5,
      paginaActual: 1
    }
  },
  // created() {
  //   this.listarNotas();
  // },
  watch: {
    "$route.query.pagina": {
      immediate: true,
      handler(pagina) {
        pagina = parseInt(pagina) || 1;
        this.listarNotasPaginadas(pagina);
        this.paginaActual = pagina;
      }
    }
  },
  methods: {
    // listarNotas() {
    //   let config = {
    //     headers: {
    //       token: this.token
    //     }
    //   }

    //   this.axios.get('/notas', config)
    //     .then(res => {
    //       this.notas = res.data.notaDB;
    //     })
    //     .catch(e => {
    //       console.log(e.response);
    //     })
    // },
    listarNotasPaginadas(pagina) {
      let config = {
        headers: {
          token: this.token
        }
      }

      let skip = (pagina - 1) * this.limite;

      this.axios.get(`/notas?limite=${this.limite}&skip=${skip}`, config)
        .then(res => {
          this.notas = res.data.notaDB;
          this.totalNotas = res.data.totalNotas;
        })
        .catch(e => {
          console.log(e.response);
        })
    },
    anyadirNota() {
      let config = {
        headers: {
          token: this.token
        }
      }

      this.axios.post('/nueva-nota', this.nota, config)
        .then(res => {
          this.notas.push(res.data);
          this.nota.nombre = '';
          this.nota.descripcion = '';
          this.showAlert('success', 'Nota añadida');
        })
        .catch(e => {
          console.log(e.response);
          let mensaje = 'Error del sistema';
          if (e.response.data.error.errors.nombre.properties.message) {
            mensaje = e.response.data.error.errors.nombre.properties.message;
          }
          this.showAlert('danger', mensaje);
        })
    },
    eliminarNota(id) {
      this.axios.delete(`/nota/${id}`)
        .then(res => {
          const index = this.notas.findIndex(item => item._id === res.data._id);
          this.notas.splice(index, 1);
          this.showAlert('success', 'Nota eliminada');
        })
        .catch(e => {
          console.log(e.response);
        })
    },
    activarEdicion(id) {
      this.modoEdicion = true;
      this.axios.get(`/nota/${id}`)
        .then(res => {
          this.notaEditar = res.data;
        })
        .catch(e => {
          console.log(e.response);
        })
    },
    editarNota(item) {
      this.axios.put(`/nota/${item._id}`, item)
        .then(res => {
          const index = this.notas.findIndex(n => n._id === res.data._id);
          this.notas[index].nombre = res.data.nombre;
          this.notas[index].descripcion = res.data.descripcion;
          this.showAlert('success', 'Nota editada');
          this.modoEdicion = false;
        })
        .catch(e => {
          console.log(e.response);
        })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert(color, texto) {
      this.mensaje.color = color;
      this.mensaje.texto = texto;
      this.dismissCountDown = this.dismissSecs;
    },
  },
  computed: {
    ...mapState(['token']),
    cantidadPaginas() {
      return Math.ceil(this.totalNotas / this.limite);
    }
  },
}
</script>