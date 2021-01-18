<style lang="less" scoped>
  .container {
    color: @font-white-color;
  }
</style>

<template lang="pug">
  section.container
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OauthAssemble',
  computed: {
    ...mapState({
      code: state => state.route.query.code,
      state: state => state.route.query.state,
      client_id: state => state.route.query.client_id,
    }),
  },
  async mounted() {
    this.$store.commit('app/SET_SHOW_BOTTOM_NAV', false);
    this.$store.commit('app/SET_SHOW_DEFAULT_STATUS_BAR', true);
    this.$toast.loading({
      message: '연결 중..',
      forbidClick: true,
      duration: 0,
    });

    if (this.state) { // app
      try {
        const state = JSON.parse(this.state || '{}');
        await this.saveCode(state.session, this.code);
        this.$router.replace(this.localePath({ path: '/oauth-assemble-app-end', query: { status: 'success' } }));
      } catch (e) {
        this.$router.replace(this.localePath({ path: '/oauth-assemble-app-end', query: { status: 'fail' } }));
      } finally {
        this.$toast.clear();
      }
    } else { // web
      await this.$axios.post('/assemble/connect', {
        client_id: this.client_id,
        code: this.code,
        redirectUri: `${window.location.origin}/oauth-assemble`,
      });
      await this.$store.dispatch('fetchMe');
      this.$toast.clear();
      this.$router.replace(this.localePath('/me'));
    }
  },
  methods: {
    async saveCode(sessionId, code) {
      await this.$axios.put(`/sessions/${sessionId}`, { value: code });
    },
  },
};
</script>
