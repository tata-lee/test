<template>
  <Card>
    <div class="student-item" v-for="(item, index) in payloads" :key="index">
      <el-select
        v-if="item.type === 'public'"
        placeholder="请选择公共key或搜索"
        filterable
        remote
        size="mini"
        v-model="item.selected"
        value-key="id"
        :remote-method=" val => handleSearchPublic(val, item)"
        :loading="item.loading"
        @change="(val) => handleSelect(item, val)"
      >
        <el-option
          v-for="opt in item.options"
          :key="opt.id"
          :label="opt.key"
          :value="opt"
        >
        </el-option>
      </el-select>
      <span>key</span>
      <el-input
        class="input"
        size="mini"
        v-model="item.key"
        :disabled="item.type !== 'custom'"
      ></el-input>
      <span>值类型</span>
      <el-select v-model="item.valueType" size="mini" placeholder="请选择">
        <el-option
          v-for="opt in valueOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        >
        </el-option>
      </el-select>
      <span>描述</span>
      <el-input
        class="input"
        size="mini"
        v-model="item.intro"
        :disabled="item.type !== 'custom'"
      ></el-input>
      <el-radio v-if="item.type === 'custom'" v-model="item.setPublic">设为公共</el-radio>
      <el-button
        @click="handleDelete(index, item.type === 'created', item.id)"
        size="mini"
        >删除</el-button
      >
    </div>
    <div style="display: inline-flex">
      <el-button class="btn left" @click="handleAddPublic()" size="mini"
        >添加公共</el-button
      >
      <el-button class="btn right" @click="handleAddCustom()" size="mini">
        <span style="margin-left: -5px">添加自定义</span>
      </el-button>
      <el-button @click="handleSubmit" size="mini">提交</el-button>
    </div>
  </Card>
</template>
<script>
import { reAssign, voidFunc, runAllPromises } from '../util';

export default {
  name: 'PayloadManage',
  props: {
    behaviour: Object,
  },
  data() {
    return {
      payloads: [],
      item: {
        source: undefined,
        key: '',
        valueType: '',
        intro: '',
        setPublic: false,
        fromPublic: false,
        type: undefined,
        loading: false,
        options: [],
        selected: '',
      },
      hotOptions: null,
      hotOptionsWatchers: [],
      valueOptions: [
        {
          label: 'String',
          value: 'String',
        },
        {
          label: 'Number',
          value: 'Number',
        },
        {
          label: 'Boolean',
          value: 'Boolean',
        },
      ],
    };
  },
  methods: {
    async getPayloadsByBehaviour(source) {
      const params = { source };
      const res = await this.$newHttp('/payload', 'get', { params }).catch();
      console.log(res);
      if (!res) return;
      res.data.forEach((payload) => {
        const newItem = { ...this.item };
        Object.assign(newItem, payload);
        newItem.type = 'created';
        this.payloads.push(newItem);
      });
    },
    async getHotOptions() {
      const res = await this.$newHttp('payload/hot', 'get').catch(voidFunc);
      if (res) {
        this.hotOptions = res;
        this.hotOptionsWatchers.forEach(f => f(res));
      }
    },
    async handleSearchPublic(val, item) {
      if (val) {
        const params = {
          source: 0,
          limit: 20,
          keyword: val,
        };
        item.loading = true;
        const res = await this.$newHttp('/payload', 'get', { params }).catch(voidFunc);
        item.loading = false;
        if (res) {
          item.options = res.data;
          console.log(res);
        }
      } else {
        item.options = this.hotOptions;
      }
    },
    deletePayload(id) {
      const data = { id };
      return this.$newHttp('/payload', 'delete', { data });
    },
    addPayload(item) {
      const data = {
        source: -1,
        key: '',
        valueType: '',
        intro: '',
        setPublic: false,
        fromPublic: false,
      };
      reAssign(data, item);
      return this.$newHttp('/payload', 'post', { data });
    },
    async handleSubmit() {
      const addPromises = this.payloads
        .filter(p => p.type !== 'created' && p.key && p.valueType)
        .map(p => this.addPayload(p));
      if (addPromises.length > 0) {
        const res = await runAllPromises(addPromises);
        if (res > 0) {
          this.$info(`成功添加${res}个key`);
        }
        this.payloads = [];
        this.getPayloadsByBehaviour(this.behaviour.id);
      }
    },
    handleAddPublic() {
      const newItem = { ...this.item };
      newItem.type = 'public';
      newItem.fromPublic = true;
      if (this.hotOptions) {
        newItem.options = this.hotOptions;
      } else {
        this.hotOptionsWatchers.push((options) => {
            newItem.options = options;
        });
        if (this.hotOptionsWatchers.length === 1) this.getHotOptions();
      }
      this.payloads.push(newItem);
    },
    handleSelect(item, val) {
      item.key = val.key;
      item.valueType = val.value_type;
      item.intro = val.intro;
    },
    handleAddCustom() {
      const newItem = { ...this.item };
      newItem.type = 'custom';
      this.payloads.push(newItem);
    },
    handleDelete(index, remote = false, id) {
      if (remote) {
        this.deletePayload(id).then(() => {
          this.payloads.splice(index, 1);
        }).catch(voidFunc);
      } else {
        this.payloads.splice(index, 1);
      }
    },
  },
  mounted() {
    if (this.behaviour) {
      this.item.source = this.behaviour.id;
      this.getPayloadsByBehaviour(this.behaviour.id);
    } else {
      this.$error('请明确要绑定的行为！不然组件可能无法正常工作');
    }
  },
};
</script>
<style scoped>
.student-item {
  margin: 4px 0;
}
.input {
  width: 100px;
}
.btn {
  height: 30px;
  margin: 0;
}
.left {
  border-radius: 15px 0 0 15px;
}
.right {
  border-radius: 0 15px 15px 0;
  border-left: none;
}
</style>
