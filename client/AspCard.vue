<style lang="less" scoped>
  .asp-card-container {
    border-radius: 14px;
    background-color: @background-charcoal-color;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: @background-charcoal-light-color;
  }
  .title {
    .mobile-h2-text();
    color: @font-white-color;
  }
  .asp-log-button {
    width: 24px;
    height: 24px;
    background-image: url(~@/assets/log.svg);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .contents {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
  .point {
    display: flex;
    align-items: center;
  }
  .point-text {
    .mobile-h1-text();
    color: @font-white-color;
    font-weight: bold;
  }
  .point-icon {
    display: block;
    width: 26.79px;
    height: 42px;
    background-image: url(~@/assets/point.svg);
    background-size: auto 42px;
    background-repeat: no-repeat;
  }
</style>

<template lang="pug">
  .asp-card-container
    header.header
      h2.title MY ASP
      nuxt-link.asp-log-button(:to="localePath('/me/asp-log')")
    .contents
      p.point
        span.point-text {{ point === null ? '불러오는 중' : Number(point).toLocaleString() }}
        i.point-icon(v-show="point !== null")
</template>

<script>
export default {
  props: {
    point: {
      type: Number,
      default: null,
    },
  },
};
</script>
