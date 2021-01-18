<style lang="less" scoped>
  @nav-height: 44px;

  .asp-log-container {
    padding-bottom: 0;
    color: @font-white-color;
  }
  @supports (padding-bottom: env(safe-area-inset-bottom, 0)) {
    .asp-log-container {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
  }
  .back-button {
    width: 30px;
    height: 30px;
    background-image: url(~@/assets/back.svg);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 20px;
  }
  .empty-contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - @nav-height - 62px);

    &.isMobileBrowser {
      height: calc(100vh - @nav-height - 62px - 28px);
    }
  }
  @supports (height: calc(100vh - @nav-height - 62px - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0))) {
    .empty-contents {
      height: calc(100vh - @nav-height - 62px - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0));
      &.isMobileBrowser {
        height: calc(100vh - @nav-height - 62px - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0) - 28px);
      }
    }
  }
  .empty-image {
    width: 107px;
    height: 85px;
    background-image: url(~@/assets/empty-activity-log.svg);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .empty-description {
    margin-top: 20px;
    .mobile-h3-text();
    font-weight: bold;
    color: @font-darken-color;
  }
  .contents {
    padding: 20px;
  }
  .section {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
  .log-wrapper {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
  .loading-indicator {
    margin: 20px 0;
    padding: 0 20px;
  }
</style>

<template lang="pug">
  section.asp-log-container(
    v-infinite-scroll="nextPage",
    :infinite-scroll-distance="600",
    :infinite-scroll-immediate-check="false")
    basic-nav(:offsetTop="isMobileBrowser ? 28 : 0")
      button.back-button(@click="back")
    header.header
      basic-container-title ASP 내역
    .empty-contents(v-if="emptyASPLogs", :class="{ isMobileBrowser }")
      .empty-image
      p.empty-description 아직 ASP 내역이 없네요.
    van-pull-refresh(
      v-model="initLoading",
      pulling-text=" ",
      loosing-text=" ",
      loading-text="불러오는 중..",
      @refresh="initASPLogs")
      .contents
        section.section(
          v-for="aspLog in aspLogs"
          :key="aspLog.title")
          basic-section-title {{ aspLog.title }}
          ul.log-list
            li.log-wrapper(
              v-for="log in aspLog.logs",
              :key="log._id")
              activity-log-list-item(v-bind="log")
      .loading-indicator(v-if="hasMore && fetchLoading")
        van-loading
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import ActivityLogListItem from '@/components/ActivityLogListItem';

const LIMIT = 15;

export default {
  name: 'ASPLog',
  middleware: ['checkAuth'],
  scrollToTop: true,
  components: {
    ActivityLogListItem,
  },
  watch: {
    page(newVal, oldVal) {
      if (this.fetchLoading) return;
      if (_.isNaN(newVal) || _.isNaN(oldVal)) return;
      if (newVal === 1) return;
      if (!_.isEqual(newVal, oldVal)) this.fetchASPLogs();
    },
  },
  computed: {
    ...mapState({
      aspLogs: state => state.aspLogs.aspLogs,
      page: state => state.aspLogs.page,
      isMobileBrowser: state => state.app.isMobileBrowser,
      me: state => state.me,
    }),
    emptyASPLogs() {
      if (!this.aspLogs || (this.aspLogs.length === 0)) return true;
      return false;
    },
  },
  data() {
    return {
      initLoading: false,
      fetchLoading: false,
      hasMore: true,
    };
  },
  async mounted() {
    this.$store.commit('app/SET_SHOW_BOTTOM_NAV', false);
    this.$store.commit('app/SET_SHOW_DEFAULT_STATUS_BAR', false);
    await this.initASPLogs();
  },
  methods: {
    async initASPLogs() {
      const params = { offset: 0, limit: LIMIT };
      this.initLoading = true;
      try {
        this.$store.commit('aspLogs/CLEAR_ASP_LOGS');
        await this.$store.dispatch('aspLogs/fetchASPLogs', params);
        this.$store.commit('aspLogs/SET_PAGE', 1);
        this.initLoading = false;
      } catch (e) {
        this.initLoading = false;
        if (!e.response || !e.response.data) return;
        this.$toast(e.response.data.message);
      }
    },
    async fetchASPLogs() {
      const params = { offset: (this.page - 1) * LIMIT, limit: LIMIT };
      this.fetchLoading = true;
      try {
        const logs = await this.$store.dispatch('aspLogs/fetchASPLogs', params);
        this.fetchLoading = false;
        if (logs.length < LIMIT) this.hasMore = false;
      } catch (e) {
        if (!e.response || !e.response.data) return;
        this.$toast(e.response.data.message);
        this.fetchLoading = false;
      }
    },
    back() {
      if (this.$history.canGoBack()) this.$router.back();
      else this.$router.push(this.localePath('/'));
    },
    nextPage() {
      if (!this.hasMore || this.fetchLoading) return;
      const nextPageNumber = Number(this.page || 1) + 1;
      this.$store.commit('aspLogs/SET_PAGE', nextPageNumber);
    },
  },
};
</script>
