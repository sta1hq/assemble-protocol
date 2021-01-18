<style lang="less" scoped>
  .oauth-assemble-app-end-container {
    padding: 20px;
    color: @font-white-color;
  }
  .title {
    margin-top: 20px;
  }
  .subtitle {
    color: @font-darken-color;
  }
</style>

<template lang="pug">
  section.oauth-assemble-app-end-container
    img(:src="imgSrc", width="330")
    h1.title {{ title }}
    p.subtitle {{ subtitle }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      status: state => state.route.query.status,
    }),
    imgSrc() {
      if (this.status === 'success') return 'https://media.giphy.com/media/Mp4hQy51LjY6A/giphy.gif';
      return 'https://media.giphy.com/media/EizPK3InQbrNK/giphy.gif';
    },
    title() {
      if (this.status === 'success') return '연결이 완료되었습니다!';
      return '연결 실패 ㅠ';
    },
    subtitle() {
      if (this.status === 'success') return '이제 창을 닫아도 좋습니다.';
      return '아마 잠시 후 다시 시도하면 될거에요';
    },
  },
  mounted() {
    if (this.status === 'success') window.close();
  },
};
</script>
