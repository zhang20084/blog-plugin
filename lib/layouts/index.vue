<template>
  <div class="layout is-home">
    <h1 class="site-title">{{ config.title || 'REAM blog' }}</h1>
    <ul class="pages" v-if="pages && pages.length">
      <li class="page" key="index" v-for="(page, index) in pages">
        <router-link :to="page.path">
          {{ page.title }}
        </router-link>
      </li>
    </ul>
    <div class="post-list" v-if="posts && posts.length">
      <router-link :to="post.path" key="index" class="post-item" v-for="(post, index) in posts">
        <h2 class="post-title">{{ post.title }}</h2>
        <time class="post-date" datetime="post.date">{{ formatedDate(post.date) }}</time>
      </router-link>
    </div>
  </div>
</template>

<script>
  import format from 'date-fns/format'

  export default {
    props: ['essays', 'config'],
    head() {
      return {
        title: this.config.title || 'REAM Blog'
      }
    },
    computed: {
      posts() {
        return this.essays.filter(essay => essay.type !== 'page')
      },
      pages() {
        return this.essays.filter(essay => essay.type === 'page')
      }
    },
    methods: {
      formatedDate(date) {
        return format(date, 'MMM Do YYYY')
      }
    }
  }
</script>

<style src="./shared.css"></style>

<style scoped>
  .site-title {
    font-weight: 300;
  }

  .post-item {
    display: flex;
    height: 40px;
    line-height: 40px;
    text-decoration: none;
    color: #5a5a5a;
    align-items: baseline;
  }

  .post-item:hover {
    color: #333;
  }

  .post-title {
    font-size: 20px;
    font-weight: 300;
    margin: 0;
  }

  .post-date {
    margin-left: 20px;
    color: #c1c1c1;
    font-size: 14px;
  }

  .pages {
    list-style: none;
    padding-left: 0;
  }

  .page a {
    color: #5a5a5a;
    text-decoration: none;
    border-bottom: 1px solid #c1c1c1;
    height: 24px;
    display: inline-block;
  }

  .page a:hover {
    border-bottom-color: #333;
    color: #333;
  }
</style>
