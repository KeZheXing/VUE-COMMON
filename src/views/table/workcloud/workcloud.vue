<template>
  <div id="app">
    <wordcloud
      :data="defaultWords"
      name-key="name"
      value-key="value"
      :color="myColors"
      :show-tooltip="true"
      :word-click="wordClickHandler"
    />
  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'
import { workCloudAnalysis } from '@/api/estable'
export default {
  name: 'App',
  components: {
    wordcloud
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
      defaultWords: [{
        'name': 'Cat',
        'value': 26
      },
      {
        'name': 'fish',
        'value': 19
      },
      {
        'name': 'things',
        'value': 18
      },
      {
        'name': 'look',
        'value': 16
      },
      {
        'name': 'two',
        'value': 15
      },
      {
        'name': 'fun',
        'value': 9
      },
      {
        'name': 'know',
        'value': 9
      },
      {
        'name': 'good',
        'value': 9
      },
      {
        'name': 'play',
        'value': 6
      }
      ]
    }
  },
  watch: {
    'id': {
      handler(val, old) {
        this.id = val
        console.log('变化了' + val)
        this.getwordcloud()
      },
      deep: true
    }
  },
  mounted() {
    console.log(this.id)
    this.getwordcloud()
  },
  methods: {
    getwordcloud() {
      workCloudAnalysis({ id: this.id }).then(response => {
        this.listLoading = false
        console.log(response.data.data.aggregations.messages.buckets)
        this.defaultWords = response.data.data.aggregations.messages.buckets
        // Just to simulate the time of the request
      })
    },
    wordClickHandler(name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    }
  }
}
</script>
