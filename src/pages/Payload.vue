<template>
  <div class="main">
    <PayloadManage :behaviour="behaviour"></PayloadManage>
  </div>
</template>
<script>
import PayloadManage from '../components/PayloadManage';

export default {
  name: 'payload',
  components: {
    PayloadManage,
  },
  data() {
    return {
      behaviour: {
        id: 11,
        name: 'test2',
        intro: 'cp',
        creator: 'manager1',
        time: 1637907925,
        app: 'cp',
      },
    };
  },
};
</script>
