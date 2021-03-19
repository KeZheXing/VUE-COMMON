<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { getExchange, invest, del, disable, createUser, createAgent, updateByp, toBindPhone, getBindPhone } from '@/api/member'
export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    console.log(this.roles.includes('ADMIN'))
    if (this.roles.includes('ADMIN')) {
      this.currentRole = 'adminDashboard'
    }

  }
}
</script>
