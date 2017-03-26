<template>
  <div class="layout is-essay">
    <article class="essay">
      <h1 class="essay-title">{{ essay.title }}</h1>
      <time class="essay-date" :datetime="essay.date">{{ formatedDate }}</time>
      <div class="essay-content markdown-body" v-html="essay.content"></div>
    </article>
    <router-link to="/" class="back-button">↩︎</router-link>
  </div>
</template>

<script>
  import format from 'date-fns/format'

  export default {
    props: ['essay', 'config'],
    head() {
      return {
        title: this.config.title ? `${this.essay.title} - ${this.config.title}` : this.essay.title
      }
    },
    computed: {
      formatedDate() {
        return format(this.essay.date, 'MMM Do YYYY')
      }
    }
  }
</script>

<style src="prismjs/themes/prism.css"></style>
<style src="./markdown.css"></style>
<style src="./shared.css"></style>

<style scoped>
  .essay-title {
    font-size: 28px;
    font-weight: 500;
    margin: 0;
  }

  .essay-date {
    color: #7c7c7c;
    font-size: 14px;
  }

  .essay-content {
    margin-top: 35px;
  }

  .back-button {
    color: #333;
    width: 55px;
    height: 55px;
    border-radius: 33px;
    background-color: #efefef;
    position: absolute;
    top: 40px;
    right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 700;
    font-size: 22px;
    line-height: 66px;
    transition: all .2s;
  }

  .back-button:hover {
    transform: scale(1.1);
    background-color: #e3e3e3;
  }

  @media screen and (max-width: 768px) {
    .back-button {
      top: 20px;
      right: 10px;
    }
  }
</style>
