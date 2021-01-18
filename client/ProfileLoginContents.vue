<style lang="less" scoped>
  .profile-login-container {
    color: @font-white-color;
  }
  .section {
    padding: 20px;
  }
  .photo-section {
    display: flex;
    align-items: center;
  }
  .photo-section-left {
    flex: 1;
  }
  .highlight {
    background: @md-linear-color;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nickname {
    margin-right: 4px;
    color: @pass-solid-bottle-color;
  }
  .subtitle {
    color: @font-darken-color;
  }
  .profile-edit-button {
    margin-top: 9px;
  }
  .activity-button {
    margin: 9px 0 0 20px;
  }
  .link-button {
    color: @accent-color;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid rgba(250, 248, 255, 0.1);
    object-fit: cover;
  }
  .empty-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid rgba(250, 248, 255, 0.1);
    font-weight: bold;
    color: @font-darken-color;
    background-color: @background-charcoal-color;
    font-size: 48px;
    line-height: 98px;
    text-align: center;
  }
  .asp-hint {
    margin-top: 10px;
    padding-left: 20px;
    font-size: 12px;
    line-height: 18px;
    color: @font-darken-color;
  }
  .duration-button {
    position: relative;
    margin-bottom: 20px;
    padding-right: 21px;
    color: @accent-color;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 21px;
      height: 21px;
      background-image: url(~@/assets/chevron-bottom.svg);
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .form-group-list {
    display: flex;
    flex-wrap: wrap;
    margin: -10px -20px;
  }
  .form-group {
    width: calc(50% - 40px);
    margin: 10px 20px;
  }
  .label {
    display: block;
    font-weight: bold;
    color: @font-darken-color;
  }
  .value {
    color: @font-white-color;
  }
  .value-wrapper {
    display: flex;
  }
  .section-title {
    margin-bottom: 0;
  }
  .section-subtitle {
    margin-bottom: 10px;
    line-height: 21px;
    color: @font-darken-color;
  }
  .payment-edit-button {
    margin-left: 10px;
  }
  .horizontal-scroll-wrapper {
    margin: 0 -20px;
  }
</style>

<template lang="pug">
  section.profile-login-container
    section.section.photo-section
      .photo-section-left
        basic-container-title #[strong.highlight(v-if="me.isMD") MD] #[strong.nickname(v-if="me.title") {{ me.title }}] {{ me.name }}
        p.subtitle #[span(v-if="mdClubName") {{ `${mdClubName} · ` }}]#[span(v-if="me.gender") {{ `${me.gender} · ` }}]{{ me.phoneNumber }}
        nuxt-link(:to="localePath('/me/edit')", v-slot="{ navigate }")
          button.link-button.profile-edit-button(@click="navigate") {{ $t('Profile.editButtonText') }}
        nuxt-link(:to="localePath('/activity-log')", v-slot="{ navigate }")
          button.link-button.activity-button(@click="navigate") 활동 로그
      .photo-section-right
        img.avatar(v-if="me.avatar", :src="me.avatar")
        p.empty-avatar(v-else) {{ firstCharacter }}
    section.section
      asp-card(:point="aspBalance", :me="me")
      p.asp-hint 어셈블 계정을 연결하고, 어셈블 포인트를 현금화하세요.
    section.section(v-if="me.isMD")
      basic-section-title 매트릭
      button.duration-button(@click="openDuration") {{ durationButtonText }}
      .form-group-list(v-if="metrics")
        .form-group
          p.label 프로필 조회
          p.value {{ metrics.views }}
        .form-group
          p.label 후기
          p.value {{ metrics.reviews }}
        .form-group
          p.label 입장권 발행
          p.value {{ metrics.issued }}
        .form-group
          p.label 사용된 입장권
          p.value {{ metrics.used }}
        .form-group
          p.label 문의 시도
          p.value {{ metrics.contact }}
    section.section(v-if="me.isMD && me.md && me.md.next")
      basic-section-title {{ $t('Profile.paymentSectionTitle') }}
      .form-group-list
        .form-group
          p.label {{ $t('Profile.paymentNext') }}
          p.value {{ me.md.next | formatDate }}
        //- TODO: 결제 붙고 처리
        //- .form-group
          p.label 결제 수단
          .value-wrapper
            p.value 국민 2532
            button.link-button.payment-edit-button 변경하기
    section.section(v-if="displayOrders && (displayOrders.length > 0)")
      basic-section-title.section-title {{ $t('Profile.passSectionTitle') }}
      p.section-subtitle {{ $t('Profile.passSectionDescription') }}
      basic-horizontal-scroll.horizontal-scroll-wrapper
        basic-horizontal-scroll-item(
          v-for="order in displayOrders",
          :key="order._id")
          pass-card(
            buttonText="열기",
            :pass="order.pass",
            :date="order.date",
            @click.native="goToMyPass(order._id)",
            @pay="goToMyPass(order._id)")
    section.section(v-if="savedClubs && savedClubs.length > 0")
      basic-section-title {{ $t('Profile.savedClubsSectionTitle') }}
      basic-horizontal-scroll.horizontal-scroll-wrapper
        basic-horizontal-scroll-item(
          v-for="club in savedClubs",
          :key="club._id")
          nuxt-link(:to="localePath(`/clubs/${club._id}`)")
            club-card(:club="club")

    duration-filter-action-sheet(
      title="매트릭 일자 필터링",
      :visible="durationVisible",
      :after="after",
      :before="before",
      @close="closeDuration"
      @submitOneMonth="fetchMetricsMonth",
      @submit="fetchMetrics")
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';
import PassCard from '@/components/PassCard';
import ClubCard from '@/components/ClubCard';
import AspCard from '@/components/AspCard';
import DurationFilterActionSheet from '@/components/DurationFilterActionSheet';

export default {
  components: {
    PassCard,
    ClubCard,
    AspCard,
    DurationFilterActionSheet,
  },
  filters: {
    formatDate: v => moment(v).tz('asia/seoul').format('L LT'),
  },
  props: {
    me: { type: Object, default: null },
    displayOrders: { type: Array, default: () => [] },
    metrics: { type: Object, default: null },
    clubs: { type: Array, default: () => [] },
  },
  computed: {
    mdClubName() {
      if (!this.me || !this.me.isMD) return null;
      const mdClub = this.clubs.find(c => c._id === this.me.md.clubId);
      return mdClub.name;
    },
    savedClubs() {
      if (!this.me || !this.me.savedClubIds) return null;
      return _.compact(this.me.savedClubIds.map(cId => this.clubs.find(c => c._id === cId)));
    },
    firstCharacter() {
      if (!this.me || !this.me.name || (this.me.name.trim().length === 0)) return null;
      const first = [...this.me.name.trim()][0].toUpperCase();
      return first;
    },
  },
  data() {
    return {
      after: null,
      before: null,
      metricDuration: 'month',
      durationVisible: false,
      durationButtonText: '최근 30일 보기',
      aspBalance: null,
    };
  },
  async mounted() {
    const after = moment().startOf('day').subtract(1, 'month').format('YYYY-MM-DD');
    const before = moment().startOf('day').format('YYYY-MM-DD');
    this.after = after;
    this.before = before;
    this.loadAsp();
  },
  methods: {
    async loadAsp() {
      try {
        const { data } = await this.$axios.get('/asp-balance');
        const { balance } = data;
        this.aspBalance = balance;
      } catch (e) {
        console.log(e);
      }
    },
    openDuration() {
      this.durationVisible = true;
    },
    closeDuration() {
      this.durationVisible = false;
    },
    goToMyPass(orderId) {
      this.$router.push(this.localePath(`/my-passes/${orderId}`));
    },
    fetchMetrics({ after, before }) {
      if (!this.me.isMD) return;
      this.$emit('fetchMetrics', { after, before });
      this.after = after;
      this.before = before;
      this.durationButtonText = `${moment(after).format('ll')} - ${moment(before).format('ll')}`;
    },
    fetchMetricsMonth() {
      const after = moment().startOf('day').subtract(29, 'day').format('YYYY-MM-DD');
      const before = moment().startOf('day').format('YYYY-MM-DD');
      this.$emit('fetchMetrics', { after, before });
      this.after = after;
      this.before = before;
      this.durationButtonText = '최근 30일 보기';
    },
  },
};
</script>
