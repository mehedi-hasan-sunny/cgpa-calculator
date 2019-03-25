<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <span class="text-uppercase">CGPA</span>
        <span class="pl-1 font-weight-light">Calculator</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <Home/>
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  components: {
    Home
  },
  data () {
    return {
      //
    }
  }
}
</script>
