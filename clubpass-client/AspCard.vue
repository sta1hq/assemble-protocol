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
  .connect-button {
    height: 24px;
    padding-right: 12px;
    color: @accent-color;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-image: url(~@/assets/asp-connect-icon.svg);
    background-size: 12px 24px;
    background-position: right center;
    background-repeat: no-repeat;
  }
</style>

<template lang="pug">
  .asp-card-container
    header.header
      h2.title Assemble Point
      nuxt-link.asp-log-button(:to="localePath('/me/asp-log')")
    .contents
      p.point
        span.point-text {{ point === null ? '불러오는 중' : Number(point).toLocaleString() }}
        i.point-icon(v-show="point !== null")
      button.connect-button(v-if="me.assembleConnected", @click="goToAssemble") 어셈블 계정
      button.connect-button(v-else, @click="goToAssembleSignIn") 연결하기
</template>

<script>
const CLIENT_ID = 'clubpass';
let timer;

export default {
  props: {
    point: {
      type: Number,
      default: null,
    },
    me: { type: Object, default: null },
  },
  data() {
    return {
      loading: false,
      session: null,
    };
  },
  methods: {
    async goToAssembleSignIn() {
      await this.createSession();

      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth-assemble`);
      const { name } = this.me;
      const oauthUrl = `https://assemble.sta1.com/signup-to-connecting?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&appUserName=${name}`;

      if (window.s3app) {
        const session = encodeURIComponent(JSON.stringify({ session: this.session._id }));
        const url = `${oauthUrl}&state=${session}`;
        window.s3app.openInAppBrowser(url);
        this.startMonitor();
      } else {
        window.location.href = oauthUrl;
      }
    },
    async createSession() {
      this.$toast.loading({
        message: '요청하는 중..',
        forbidClick: true,
        duration: 0,
      });
      try {
        const { data: session } = await this.$axios.post('/sessions');
        this.session = session;
        this.$toast.clear();
      } catch (e) {
        if (!e.response || !e.response.data) return;
        this.$toast(e.response.data.message);
      }
    },
    startMonitor() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => this.checkSession(this.session._id), 1000);
    },
    async checkSession(sessionId) {
      try {
        const { data: session } = await this.$axios.get(`/sessions/${sessionId}`);
        if (session.value) {
          this.$toast.loading({
            message: '연결하는 중..',
            forbidClick: true,
            duration: 0,
          });
          if (timer) clearInterval(timer);
          this.$axios.delete(`/sessions/${sessionId}`);
          const code = session.value;
          await this.$axios.post('/assemble/connect', {
            code,
            redirectUri: `${window.location.origin}/oauth-assemble`,
          });
          await this.$store.dispatch('fetchMe');
          this.$toast.clear();
        }
      } catch (e) {
        alert(e);
        if (timer) clearInterval(timer);
      }
    },
    goToAssemble() {
      if (window.s3app) {
        window.s3app.openInAppBrowser('https://assemble.sta1.com');
      } else {
        window.open('https://assemble.sta1.com');
      }
    },
  },
};
</script>
